import { Response } from "express";
import { AppError } from "../middlewares/error-middleware.js";
import User from "../models/user-model.js";
import {
  CustomRequest,
  IUser,
  LoginPayload,
  RegisterPayload,
} from "../types/user.js";
import { clearCookie, setCookie } from "../helpers/cookie.js";
import { generateToken } from "../helpers/generate-token.js";

export const register = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      contact,
      languagePreference,
    }: RegisterPayload = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const user: IUser = new User({
      name,
      email,
      password,
      role,
      contact,
      languagePreference: languagePreference || "en",
    });

    await user.save();

    const token = generateToken({ userId: user._id, role: user.role });

    setCookie(res, "jwt", token);

    res.status(201).json({
      message: "User registered successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        languagePreference: user.languagePreference,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password }: LoginPayload = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({ userId: user._id, role: user.role });

    setCookie(res, "jwt", token);

    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        languagePreference: user.languagePreference,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    clearCookie(res, "jwt");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    throw new AppError("Failed to logout", 500);
  }
};

export const getUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select(
      "_id name email role contact languagePreference"
    );
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    throw new AppError("Failed to fetch users", 500);
  }
};
