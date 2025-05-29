import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken"
import { Errors, StatusCodes } from "src/core/constant/errorName";

export const errorHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
  error: Error,
  code: number
) => {
  if (error.name === 'DomainError') {
    // const statusCode = StatusCodes[error.name] || 500;
    return res.status(code).send({
      status: false,
      error: error.name,
      message: error.message,
      data: {}
    });
  };

  if (error instanceof MongooseError.ValidationError) {
    const errors: Record<string, string[]> = {};

    for (const key in error.errors) {
      if (Object.prototype.hasOwnProperty.call(error.errors, key)) {
        errors[key] = [error.errors[key].message];
      }
    };

    console.log("[Mongoose Validation Error] => ", error);

    return res.status(422).send({
      error: "validation_error",
      message: "The provided payload was not valid",
      data: errors,
    });
  };

  if (error instanceof MongooseError.CastError) {
    return res.status(400).send({
      error: 'bad_request',
      message: `Invalid value for ${error.path}: ${error.value}`,
      data: {}
    });
  };

  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    return res.status(409).send({
      error: 'duplicate_key',
      message: ` ${field} already exists.`,
      data: {}
    });
  };

  if (error instanceof JsonWebTokenError) {
    return res.status(498).json({
      status: false,
      message: 'Invalid Token',
      data: null
    });
  };

  console.log('[Unhandled Error] => ', error);
  return res.status(500).send({
    status: false,
    error: 'server_error',
    message: Errors.SERVER_ERROR,
    data: {}
  });
};
