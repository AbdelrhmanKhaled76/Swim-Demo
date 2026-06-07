import { registerValidator, loginValidator } from "../utils/validators.js";
import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const generateToken = (id, role, organizationID) => {
  return jwt.sign({ id, role, organizationID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ── Register (public) ─────────────────────────────────────────────────────────
// A fresh registration ALWAYS creates a new Organization and assigns role=Admin.
// To add sub-users (WarehouseOwner / StoreManager), use POST /api/auth/invite (Admin only).
export const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400;
      throw validationError;
    }

    const { username, email, password, organizationName } = value;

    // Check email uniqueness
    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered, try logging in");
      emailError.statusCode = 400;
      throw emailError;
    }

    // Create the user first (without org) so we have an _id for ownerId
    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role: "Admin",        // First registration → always Admin
    });

    // Auto-create Organization with the new user as owner
    const orgName = organizationName || `${username}'s Organization`;
    let organization;
    try {
      organization = await Organization.create({
        name: orgName,
        ownerId: user._id,
        tier: "free",
      });
    } catch (orgErr) {
      // If org name is taken, clean up the user and throw
      await User.findByIdAndDelete(user._id);
      if (orgErr.code === 11000) {
        const dupError = new Error(
          `Organization name '${orgName}' is already taken. Please provide a unique organizationName.`
        );
        dupError.statusCode = 409;
        throw dupError;
      }
      throw orgErr;
    }

    // Link user to org
    user.organizationID = organization._id;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role, user.organizationID);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organizationID: user.organizationID,
        organization: {
          _id: organization._id,
          name: organization.name,
          tier: organization.tier,
        },
      },
      message: "User registered successfully and organization created",
    });
  } catch (err) {
    next(err);
  }
};

// ── Invite Sub-User (Admin only – protected route) ────────────────────────────
// Admin creates a WarehouseOwner or StoreManager under their own organization.
export const inviteUser = async (req, res, next) => {
  try {
    const { error, value } = inviteValidator.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400;
      throw validationError;
    }

    const { username, email, password, role } = value;

    // Only WarehouseOwner / StoreManager can be created via invite
    if (role === "Admin") {
      const roleError = new Error("Cannot invite another Admin. Use register instead.");
      roleError.statusCode = 400;
      throw roleError;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered");
      emailError.statusCode = 400;
      throw emailError;
    }

    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role,
      organizationID: req.user.organizationID, // inherit from calling Admin's org
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organizationID: user.organizationID,
      },
      message: `${role} invited successfully`,
    });
  } catch (err) {
    next(err);
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400;
      throw validationError;
    }

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      const authError = new Error("Invalid email or password");
      authError.statusCode = 401;
      throw authError;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const authError = new Error("Invalid email or password");
      authError.statusCode = 401;
      throw authError;
    }

    const token = generateToken(user._id, user.role, user.organizationID);

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        organizationID: user.organizationID,
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error("No user found with that email");
      error.statusCode = 404;
      throw error;
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:3000/api/auth/resetpassword/${resetToken}`;
    res.status(200).json({
      success: true,
      message: "Token generated (pretend this was sent via email)",
      data: { resetToken, resetUrl },
    });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
    }

    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id, user.role, user.organizationID);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ── Invite validator (defined locally to keep validators.js clean) ────────────
import Joi from "joi";
const inviteValidator = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "any.required": "Username is a mandatory field",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email can not be empty",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is a mandatory field",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password can not be empty",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string()
    .valid("WarehouseOwner", "StoreManager")
    .required()
    .messages({
      "any.only": "Role must be either WarehouseOwner or StoreManager",
      "any.required": "Role is required",
    }),
});
