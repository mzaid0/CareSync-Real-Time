// auth-middleware.ts

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, UserPayload } from "../types/user";
import { AppError } from "./error-middleware.js";
import { logger } from "../utils/logger.js";
import { Types } from "mongoose";

export const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new AppError("No token provided, authentication required", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("JWT secret not configured", 500);
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    req.user = {
      userId: new Types.ObjectId(decoded.userId),
      role: decoded.role as UserPayload["role"],
    };

    logger.info(
      `User authenticated: ID=${decoded.userId}, Role=${decoded.role}`
    );
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired, please log in again", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token, authentication failed", 401);
    }
    throw error;
  }
};
