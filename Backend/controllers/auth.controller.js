import { registerValidator, loginValidator } from "../utils/validators.js";
import User from "../models/user.model.js";
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

    const { fullName, email, password, orgName, warehouse, industry } = value;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered");
      emailError.statusCode = 400;
      throw emailError;
    }

    const user = await User.create({
      fullName: fullName,
      email: email,
      passwordHash: password,
      role: "Owner",
    });
    createdUserId = user._id;

    const newOrganization = await Organization.create({
      name: orgName,
      industry: industry || "Not Specified",
      ownerId: user._id,
    });
    createdOrgId = newOrganization._id;

    const newLocation = await Location.create({
      name: warehouse,
      organizationId: newOrganization._id,
      type: "Warehouse",
    });

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
      },
      message: "Account, Organization, and Location created successfully",
    });
  } catch (err) {
    if (createdUserId) {
      await User.findByIdAndDelete(createdUserId);
    }
    if (createdOrgId) {
      await Organization.findByIdAndDelete(createdOrgId);
    }

    next(err);
  }
};

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
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};
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

export const addStoreManager = async (req, res, next) => {
  try {
    
    if (req.user.role !== 'Owner') {
      const error = new Error("Access Denied: Only Owners can add store managers.");
      error.statusCode = 403; 
      throw error;
    }

    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const emailError = new Error("Email is already registered in the system.");
      emailError.statusCode = 400;
      throw emailError;
    }

    const newManager = await User.create({
      fullName: fullName,
      email: email,
      passwordHash: password,
      role: 'StoreManager',
      organizationID: req.user.organizationID 
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newManager._id,
        fullName: newManager.fullName,
        email: newManager.email,
        role: newManager.role,
        organizationID: newManager.organizationID
      },
      message: "Store Manager added successfully to your organization."
    });

  } catch (err) {
    next(err);
  }
};
