import { z } from "zod";
import { validate } from "../middlewares/validator-middleware.js";

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorName: z.string().nonempty("Doctor name is required"),
    location: z.string().nonempty("Location is required"),
    time: z
      .string()
      .nonempty("Time is required")
      .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: "Invalid time format (HH:mm)",
      }),
    date: z
      .string()
      .nonempty("Date is required")
      .refine((val) => new Date(val) >= new Date(), {
        message: "Date cannot be in the past",
      }),
  }),
});

export const getAppointmentByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Appointment ID is required")
      .refine((val) => mongoIdRegex.test(val), {
        message: "Invalid appointment ID format",
      }),
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Appointment ID is required")
      .refine((val) => mongoIdRegex.test(val), {
        message: "Invalid appointment ID format",
      }),
  }),
  body: z.object({
    doctorName: z.string().nonempty("Doctor name is required"),
    location: z.string().nonempty("Location is required"),
    time: z
      .string()
      .nonempty("Time is required")
      .refine((val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: "Invalid time format (HH:mm)",
      }),
    date: z
      .string()
      .nonempty("Date is required")
      .refine((val) => new Date(val) >= new Date(), {
        message: "Date cannot be in the past",
      }),
    status: z.enum(["Scheduled", "Completed", "Cancelled"], {
      errorMap: () => ({ message: "Invalid appointment status" }),
    }),
  }),
});

export const deleteAppointmentSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Appointment ID is required")
      .refine((val) => mongoIdRegex.test(val), {
        message: "Invalid appointment ID format",
      }),
  }),
});

export const validateCreateAppointment = validate(createAppointmentSchema);
export const validateGetAppointmentById = validate(getAppointmentByIdSchema);
export const validateUpdateAppointment = validate(updateAppointmentSchema);
export const validateDeleteAppointment = validate(deleteAppointmentSchema);
