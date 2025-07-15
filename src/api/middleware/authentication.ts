import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import setting from "src/core/config/application";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from "src/core/enum/httpCode";
import { CustomError } from "src/core/error/CustomError";
import { Customer } from "src/core/models/customer";
import { Manager } from "src/core/models/manager";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role?: 'manager' | 'customer';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

interface JwtPayload {
  user: {
    userId: string;
    email: string;
    role?:string;
  };
};


export const authenticate = async (
  req: Request,
  _res: Response,
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

    const { user } = jwt.verify(token, setting.jwt.secret) as JwtPayload;

    let authUser;

    if (user?.userId) {
      authUser = await Customer.findById(user.userId);
      if (!authUser) {
        authUser = await Manager.findById(user.userId);
        if (!authUser) {
          throw new CustomError(
            "Authorization denied. User not found",
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }
      }
    };

    req.user = {
      userId: user.userId,
      email: user.email,
      role: user.role === "manager" || user.role === "customer"
        ? user.role
        : authUser instanceof Manager
        ? "manager"
        : authUser instanceof Customer
        ? "customer"
        : undefined,
    };

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

export const authorizeManager = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "manager") {
    res.status(403).json({ message: "Access denied: Manager role required" });
    return;
  }
  next();
};
