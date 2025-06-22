import { z } from "zod";
import { validate } from "../middlewares/validator-middleware.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    role: z.enum(["user", "caregiver", "family_member", "admin"], {
      errorMap: () => ({ message: "Invalid role" }),
    }),
    contact: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid contact number")
      .optional(),
    languagePreference: z.string().default("en"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  }),
});

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
