import { Document, Types } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "caregiver" | "family_member" | "admin";
  contact?: string;
  languagePreference?: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserPayload {
  userId?: Types.ObjectId | string | unknown;
  role: "user" | "caregiver" | "family_member" | "admin";
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "user" | "caregiver" | "family_member" | "admin";
  contact?: string;
  languagePreference?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
