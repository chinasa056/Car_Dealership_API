import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const createCategoryValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).required().messages({
      'any.required': 'Category name is required.',
      'string.empty': 'Category name cannot be empty.',
      'string.min': 'Category name must be at least 2 characters long.',
    }),
    description: Joi.string().trim().allow('').optional().messages({
      'string.base': 'Description must be a string.',
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

export const updateCategoryValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).messages({
      'string.empty': 'Category name cannot be empty.',
      'string.min': 'Category name must be at least 2 characters long.',
    }),
    description: Joi.string().trim().allow('').messages({
      'string.base': 'Description must be a string.',
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
