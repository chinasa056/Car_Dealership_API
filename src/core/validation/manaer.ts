// src/core/helpers/validator.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const createManagerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).required().messages({
      'any.required': 'Manager name is required.',
      'string.empty': 'Manager name cannot be empty.',
      'string.min': 'Manager name must be at least 2 characters long.',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
    }),
    password: Joi.string().min(4).required().messages({
      'any.required': 'Password is required.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 4 characters long.',
    }),
    role: Joi.string().valid('admin', 'manager').optional().messages({
      'any.only': 'Role must be either "admin" or "manager".',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
     res.status(422).json({
      message: 'Validation errors occurred.',
      errors: error.details.map((detail) => detail.message),
    });
    return
  };

  next();
};

export const loginManagerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required.',
      'string.email': 'Please provide a valid email address.',
      'string.empty': 'Email cannot be empty.',
    }),
    password: Joi.string().min(4).required().messages({
      'any.required': 'Password is required.',
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 4 characters long.',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
     res.status(422).json({
      message: 'Validation errors occurred.',
      errors: error.details.map((detail) => detail.message),
    });
    return
  };

  next();
};
