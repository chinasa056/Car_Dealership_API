
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const createCarValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    brand: Joi.string().trim().min(2).required().messages({
      'any.required': 'Car brand is required.',
      'string.empty': 'Car brand cannot be empty.',
      'string.min': 'Car brand must be at least 2 characters long.',
    }),
    carModel: Joi.string().trim().min(1).required().messages({
      'any.required': 'Car model is required.',
      'string.empty': 'Car model cannot be empty.',
    }),
    price: Joi.number().positive().required().messages({
      'any.required': 'Price is required.',
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be a positive number.',
    }),
    year: Joi.number().integer().min(1886).max(new Date().getFullYear()).required().messages({
      'any.required': 'Year is required.',
      'number.base': 'Year must be a number.',
      'number.min': 'Year must be a valid car production year.',
      'number.max': 'Year cannot be in the future.',
    }),
    available: Joi.boolean().optional().messages({
      'boolean.base': 'Available must be true or false.',
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
     res.status(422).json({
      message: 'Validation errors occurred.',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

export const updateCarValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    brand: Joi.string().trim().min(2).optional(),
    carModel: Joi.string().trim().min(1).optional(),
    price: Joi.number().positive().optional(),
    year: Joi.number().integer().min(1886).max(new Date().getFullYear()).optional(),
    available: Joi.boolean().optional(),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update.',
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

