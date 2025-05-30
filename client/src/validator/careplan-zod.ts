import { z } from "zod";

const taskStatusEnum = z.enum(["Pending", "Completed", "In Progress"]);

export const carePlanSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  tasks: z
    .array(
      z.object({
        taskName: z.string().min(1, "Task name is required"),
        assignedTo: z.string().min(1, "Assigned user is required"),
        dueDate: z.string().min(1, "Due date is required"),
        status: taskStatusEnum,
      })
    )
    .min(1, "At least one task is required"),
});

export type TaskStatus = z.infer<typeof taskStatusEnum>;
export type CarePlanFormValues = z.infer<typeof carePlanSchema>;
