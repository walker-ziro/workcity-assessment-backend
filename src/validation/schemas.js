const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username must contain only alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 50 characters',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
      'any.required': 'Password is required'
    }),
  role: Joi.string()
    .valid('admin', 'user')
    .default('user')
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

const clientSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  phone: Joi.string()
    .trim()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    zipCode: Joi.string().trim(),
    country: Joi.string().trim()
  }),
  company: Joi.string().trim(),
  industry: Joi.string().trim(),
  isActive: Joi.boolean().default(true)
});

const projectSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  client: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid client ID format',
      'any.required': 'Client is required'
    }),
  status: Joi.string()
    .valid('planning', 'in-progress', 'completed', 'on-hold', 'cancelled')
    .default('planning'),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium'),
  budget: Joi.number()
    .min(0)
    .messages({
      'number.min': 'Budget must be a positive number'
    }),
  startDate: Joi.date()
    .iso()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    }),
  deliverables: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      completed: Joi.boolean().default(false)
    })
  ),
  teamMembers: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  ),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean().default(true)
});

module.exports = {
  signupSchema,
  loginSchema,
  clientSchema,
  projectSchema
};
