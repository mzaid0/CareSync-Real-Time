import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z0-9]/, "Password must be alphanumeric"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  role: z.enum(["user", "caregiver", "family_member"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-zA-Z0-9]/, "Password must be alphanumeric"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
