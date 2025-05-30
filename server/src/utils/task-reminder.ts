import cron from "node-cron";
import CarePlan from "../models/careplan-model.js";
import { Notification } from "../models/notification-model.js";
import { io } from "../services/socket-service.js";
import { logger } from "../utils/logger.js";

export const startTaskReminderCron = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
      const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

      const carePlans = await CarePlan.find({
        "tasks.dueDate": { $gte: startOfDay, $lte: endOfDay },
      });

      for (const plan of carePlans) {
        for (const task of plan.tasks) {
          if (
            new Date(task.dueDate) >= startOfDay &&
            new Date(task.dueDate) <= endOfDay
          ) {
            const notification = new Notification({
              userId: task.assignedTo,
              message: `Task "${task.taskName}" is due tomorrow`,
              type: "task_reminder",
              carePlanId: plan._id,
              taskId: task._id,
            });
            await notification.save();
            // Emit directly via Socket.IO
            io.to(task.assignedTo.toString()).emit("task:reminder", {
              notificationId: notification._id,
              userId: task.assignedTo,
              message: notification.message,
              carePlanId: plan._id,
              taskId: task._id,
            });
            logger.info(`Emitted task:reminder to user ${task.assignedTo}`);
          }
        }
      }
    } catch (error) {
      logger.error("Task reminder cron error:", error);
    }
  });
};
