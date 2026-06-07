import Joi from "joi";

export const registerValidator = Joi.object({
  fullName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "FullName is required",
    "string.min": "FullName must be at least 3 characters",
    "any.required": "FullName is a mandatory field",
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
  confirmPassword: Joi.any().valid(Joi.ref('password')).optional(),
//   confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
//     "any.only": "Passwords do not match , try again",
//     "any.required": "Confirm Password is required",
//   }),
  // role:Joi.string().valid('Admin','WarehouseOwner','StoreManager').messages({
  //     'any.only':'Role must be one of Admin, WarehouseOwner, or StoreManager',
  // }),
  // organizationID:Joi.string().hex().length(24).messages({
  //     'string.length':'Organization ID must be 24 characters long',
  // }),
  orgName: Joi.string().required().messages({
    "string.empty": "Organization name cannot be empty",
    "any.required": "Organization name is required",
  }),
  warehouse: Joi.string().required().messages({
    "string.empty": "Warehouse name cannot be empty",
    "any.required": "Warehouse name is required",
  }),
  industry: Joi.string().optional().allow(""),
});

export const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email can not be empty",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password can not be empty",
  }),
});
