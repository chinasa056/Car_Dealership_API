import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import setting from "src/core/config/application";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from "src/core/enum/httpCode";
import { CustomError } from "src/core/error/CustomError";
import { Customer } from "src/core/models/customer";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new CustomError(
        "Authorization denied. No token provided",
        ErrorCode.AUTHENTICATION_ERROR,
        HttpStatus.UNAUTHORIZED
      );
    }
    const decodedToken = jwt.verify(token, setting.jwt.secret) as JwtPayload;
    if (decodedToken && decodedToken.id) {
      const user = await Customer.findOne({ id: decodedToken.id });
      if (!user) {
        throw new CustomError(
          "Authorization denied. User not found",
          ErrorCode.NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
    }

    res.locals.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(
        new CustomError(
          "Token has expired",
          ErrorCode.TOKEN_EXPIRED,
          HttpStatus.UNAUTHORIZED
        )
      );
    } else {
      next(error);
    }
  }
};

export const authorizeManager = (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user?.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied: Manager role required' });
}
    next();
};
