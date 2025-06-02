import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken"
import { Errors } from "src/core/enum/error";
import { CustomError } from "src/core/error/CustomError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({
      status: false,
      error: error.errorCode,
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
      status: false,
      error: "validation_error",
      message: "The provided payload was not valid",
      data: errors,
    });
  };

  // if (error instanceof MongooseError.CastError) {
  //   return res.status(400).send({
  //     status: false,
  //     error: 'bad_request',
  //     message: `Invalid value for ${error.path}: ${error.value}`,
  //     data: {}
  //   });
  // };

  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    return res.status(409).send({
      status: false,
      error: 'duplicate_key',
      message: `${field} already exists.`,
      data: error.message
    });
  };

  if (error instanceof JsonWebTokenError) {
    return res.status(498).json({
      status: false,
      error: 'invalid_token',
      message: 'Invalid token',
      data: error.message
    });
  };

  console.log('[Unhandled Error] => ', error);
  return res.status(500).send({
    status: false,
    error: 'server_error',
    message: Errors.SERVER_ERROR,
    data:error.message
  });
};
