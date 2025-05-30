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

// export const errorHandleError = (error: Error, res: Response, customMessage: string, httpCode: number) => {
//     console.error(error); 
//     res.status(httpCode).json({
//         message: customMessage,
//         data: error.message 
//     });
// };
