import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const registerCustomerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).required().messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 2 characters long.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cant be empty.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().min(4).required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 4 characters long.',
      'any.required': 'Password is required.',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required().messages({
      'string.pattern.base': 'Phone must be a valid phone number.',
      'string.empty': 'Phone number is required.',
      'any.required': 'Phone number is required.',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
     res.status(422).json({
      message: 'Validation errors occurred.',
      errors: error.details.map((detail) => detail.message),
    });
    return
  }

  next();
};

export const loginCustomerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().min(4).required().messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 4 characters long.',
      'any.required': 'Password is required.',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
     res.status(422).json({
      message: 'Validation errors occurred.',
      errors: error.details.map((detail) => detail.message),
    });
    return
  }

  next();
};
