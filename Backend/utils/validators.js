import Joi from "joi";

// ── Auth ─────────────────────────────────────────────────────────────────────
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
  confirmPassword: Joi.any().valid(Joi.ref("password")).optional().messages({
    "any.only": "Passwords do not match, try again",
  }),
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

// ── Customer ─────────────────────────────────────────────────────────────────
export const createCustomerValidator = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Customer name is required",
    "string.min": "Name must be at least 2 characters",
    "any.required": "Customer name is a mandatory field",
  }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number format is invalid",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email must be a valid email address",
  }),
});

// ── Item ─────────────────────────────────────────────────────────────────────
export const createItemValidator = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    "string.empty": "Item name is required",
    "string.min": "Item name must be at least 2 characters",
    "any.required": "Item name is a mandatory field",
  }),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is a mandatory field",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is a mandatory field",
  }),
  imageUrl: Joi.string().uri().optional().messages({
    "string.uri": "Image URL must be a valid URL",
  }),
});

// ── Order ─────────────────────────────────────────────────────────────────────
export const createOrderValidator = Joi.object({
  customerId: Joi.string().hex().length(24).required().messages({
    "string.length": "Customer ID must be a valid 24-character ObjectId",
    "any.required": "Customer ID is required",
  }),
  storeId: Joi.string().hex().length(24).required().messages({
    "string.length": "Store ID must be a valid 24-character ObjectId",
    "any.required": "Store ID is required",
  }),
  items: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().positive().required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Order must contain at least one item",
      "any.required": "Items are required",
    }),
  totalPrice: Joi.number().min(0).optional(),
  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .optional(),
  notes: Joi.string().max(500).optional(),
});