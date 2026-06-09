import { registerValidator, loginValidator } from "../utils/validators.js";
import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import Location from "../models/location.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Organization from "../models/organization.model.js";
import Location from "../models/location.model.js";
import Joi from "joi";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id, role, organizationID) => {
  return jwt.sign({ id, role, organizationID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ── Register (public) ─────────────────────────────────────────────────────────
// A fresh registration creates a new Organization, Location, and assigns role=Owner.
export const register = async (req, res, next) => {
  let createdUserId = null;
  let createdOrgId = null;

  try {
    const { error, value } = registerValidator.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400;
      throw validationError;
    }

    // Blended schema: fullName/warehouse from main, combined with organization features
    const { fullName, email, password, orgName, warehouse, industry } = value;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered, try logging in");
      emailError.statusCode = 400;
      throw emailError;
    }

    // Create the user first
    const user = await User.create({
      fullName: fullName,
      email: email,
      passwordHash: password,
      role: "Owner", 
    });
    createdUserId = user._id;

    // Auto-create Organization
    let newOrganization;
    try {
      newOrganization = await Organization.create({
        name: orgName || `${fullName}'s Organization`,
        industry: industry || "Not Specified",
        ownerId: user._id,
        tier: "free", // Kept from feature branch
      });
      createdOrgId = newOrganization._id;
    } catch (orgErr) {
      if (orgErr.code === 11000) {
        const dupError = new Error(`Organization name is already taken. Please provide a unique organizationName.`);
        dupError.statusCode = 409;
        throw dupError;
      }
      throw orgErr;
    }

    // Create Location (from main branch)
    const newLocation = await Location.create({
      name: warehouse,
      organizationId: newOrganization._id,
      type: "Warehouse",
    });

    // Link user to org
    user.organizationID = newOrganization._id;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role, user.organizationID);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationID: user.organizationID,
        organization: {
          _id: newOrganization._id,
          name: newOrganization.name,
          tier: newOrganization.tier,
        },
      },
      message: "Account, Organization, and Location created successfully",
    });
  } catch (err) {
    // Rollback logic from main branch
    if (createdUserId) await User.findByIdAndDelete(createdUserId);
    if (createdOrgId) await Organization.findByIdAndDelete(createdOrgId);
    next(err);
  }
};

// ── Invite validator ──────────────────────────────────────────────────────────
const inviteValidator = Joi.object({
  fullName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full Name is required",
    "string.min": "Full Name must be at least 3 characters",
    "any.required": "Full Name is a mandatory field",
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
    .valid("StoreManager")
    .required()
    .messages({
      "any.only": "Role must be StoreManager",
      "any.required": "Role is required",
    }),
    assignedLocation: Joi.string().hex().length(24).when("role", {
  is: "StoreManager",
  then: Joi.required(),
  otherwise: Joi.optional().allow(null, "")
})
});

// ── Invite Sub-User (Protected route, Owner only via middleware) ───────────────
export const inviteUser = async (req, res, next) => {
  try {
    const { error, value } = inviteValidator.validate(req.body);
    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.statusCode = 400;
      throw validationError;
    }

    const { fullName, email, password, role, assignedLocation } = value;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered in the system.");
      emailError.statusCode = 400;
      throw emailError;
    }

    if (role === "StoreManager") {
      if (!assignedLocation) {
        const locReqError = new Error("StoreManager must be assigned to a location.");
        locReqError.statusCode = 400;
        throw locReqError;
      }

      const location = await Location.findById(assignedLocation);

      if (!location) {
        const locNotFoundError = new Error("Assigned location not found.");
        locNotFoundError.statusCode = 404;
        throw locNotFoundError;
      }

      if (location.organizationId.toString() !== req.user.organizationID.toString()) {
        const orgError = new Error("Location does not belong to your organization.");
        orgError.statusCode = 403;
        throw orgError;
      }

      if (location.type !== "Store") {
        const typeError = new Error("A StoreManager can only be assigned to a Store, not a Warehouse.");
        typeError.statusCode = 400;
        throw typeError;
      }

      const managerExists = await User.findOne({
        assignedLocation,
        role: "StoreManager",
      });

      if (managerExists) {
        const dupError = new Error("A StoreManager is already assigned to this store/location.");
        dupError.statusCode = 400;
        throw dupError;
      }
    }

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      passwordHash: password,
      role: role,
      organizationID: req.user.organizationID,
      assignedLocation: role === "StoreManager" ? assignedLocation : null,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        organizationID: newUser.organizationID,
        assignedLocation: newUser.assignedLocation,
      },
      message: `${role} added successfully to your organization.`,
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
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationID: user.organizationID,
        assignedLocation: user.assignedLocation,
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

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

   try {
      console.log("Attempting to send email..."); 
      await sendEmail({
        email: user.email,
        subject: "Password Reset Token",
        message,
      });
      console.log("Email sent successfully!"); 
      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      console.error(" REAL MAILTRAP ERROR:", err); 

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      const error = new Error("Email could not be sent");
      error.statusCode = 500;
      throw error;
    }
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