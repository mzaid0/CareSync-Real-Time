import { z } from "zod";
import { validate } from "../middlewares/validator-middleware.js";

export const createCarePlanSchema = z.object({
  body: z.object({
    title: z.string().nonempty("Title is required"),
    tasks: z
      .array(
        z.object({
          taskName: z.string().nonempty("Task name is required"),
          assignedTo: z
            .string()
            .nonempty("Assigned user ID is required")
            .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
              message: "Invalid assigned user ID format",
            }),
          dueDate: z
            .string()
            .nonempty("Due date is required")
            .refine((val) => new Date(val) >= new Date(), {
              message: "Due date must be in the future",
            }),
        })
      )
      .nonempty("At least one task is required")
      .max(50, "Max 50 tasks allowed"),
  }),
});

export const getCarePlanByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Care plan ID is required")
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid care plan ID format",
      }),
  }),
});

export const updateCarePlanSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Care plan ID is required")
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid care plan ID format",
      }),
  }),
  body: z.object({
    title: z.string().nonempty("Title is required"),
    tasks: z
      .array(
        z.object({
          taskName: z.string().nonempty("Task name is required"),
          assignedTo: z
            .string()
            .nonempty("Assigned user ID is required")
            .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
              message: "Invalid assigned user ID format",
            }),
          dueDate: z
            .string()
            .nonempty("Due date is required")
            .refine((val) => new Date(val) >= new Date(), {
              message: "Due date must be in the future",
            }),
        })
      )
      .max(50, "Max 50 tasks allowed")
      .optional(),
  }),
});

export const updateTaskStatusSchema = z.object({
  params: z.object({
    carePlanId: z
      .string()
      .nonempty("Care plan ID is required")
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid care plan ID format",
      }),
    taskId: z
      .string()
      .nonempty("Task ID is required")
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid task ID format",
      }),
  }),
  body: z.object({
    status: z.enum(["Pending", "Completed", "In Progress"], {
      errorMap: () => ({ message: "Invalid task status" }),
    }),
  }),
});


export const deleteCarePlanSchema = z.object({
  params: z.object({
    id: z
      .string()
      .nonempty("Care plan ID is required")
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid care plan ID format",
      }),
  }),
});

export const validateCreateCarePlan = validate(createCarePlanSchema);
export const validateGetCarePlanById = validate(getCarePlanByIdSchema);
export const validateUpdateCarePlan = validate(updateCarePlanSchema);
export const validateUpdateTaskStatus = validate(updateTaskStatusSchema);
export const validateDeleteCarePlan = validate(deleteCarePlanSchema);
