import { Response } from 'express';

export const responseHandler = (
  payload: { [key: string]: any } | any[],
  message = "success"
): { message: string; data: any } => {
  return {
    message,
    data: payload || {},
  };
};
