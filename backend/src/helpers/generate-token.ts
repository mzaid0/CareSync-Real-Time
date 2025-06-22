import jwt from "jsonwebtoken";
import { UserPayload } from "../types/user.js";

export const generateToken = (payload: UserPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT Secret not found. Please check your environment variables."
    );
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): UserPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT Secret not found. Please check your environment variables."
    );
  }
  return jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
};
