import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../middlewares/error-middleware.js";
import CarePlan from "../models/careplan-model.js";
import { Notification } from "../models/notification-model.js";
import { io } from "../services/socket-service.js";
import { ICarePlan } from "../types/careplan.js";
import { CustomRequest } from "../types/user.js";
import { redisClient } from "../services/redis-client.js";
import { logger } from "../utils/logger.js";

// Create a new care plan (only family_member or admin)
export const createCarePlan = async (req: CustomRequest, res: Response) => {
  const { userId, title, tasks } = req.body;
  const creatorRole = req?.user?.role;

  if (!creatorRole || !["family_member", "admin"].includes(creatorRole)) {
    throw new AppError(
      "Only family members or admins can create care plans",
      403
    );
  }

  const carePlan = new CarePlan({ userId, title, tasks });
  await carePlan.save();

  // Create notifications for relevant users
  const notificationPromises = [];
  // Notify the patient (userId)
  notificationPromises.push(
    new Notification({
      userId,
      message: `New care plan "${title}" created for you`,
      type: "careplan_added",
      carePlanId: carePlan._id,
      relatedEntity: { type: "CarePlan", id: carePlan._id },
    }).save()
  );
  // Notify assigned caregivers for each task
  for (const task of tasks) {
    notificationPromises.push(
      new Notification({
        userId: task.assignedTo,
        message: `New task "${task.taskName}" assigned to you in care plan "${title}"`,
        type: "task_assigned",
        carePlanId: carePlan._id,
        taskId: task._id,
        relatedEntity: { type: "CarePlan", id: carePlan._id },
      }).save()
    );
  }
  const notifications = await Promise.all(notificationPromises);

  // Emit events via Socket.IO
  io.emit("careplan:created", { carePlan });
  for (const notification of notifications) {
    io.to(notification.userId.toString()).emit(notification.type, {
      notificationId: notification._id,
      userId: notification.userId,
      message: notification.message,
      carePlanId: notification.carePlanId,
      taskId: notification.taskId,
      relatedEntity: notification.relatedEntity,
    });
    logger.info(`Emitted ${notification.type} to user ${notification.userId}`);
  }

  // Invalidate cache for care plans
  await redisClient.del(`careplans:${userId}`);
  await redisClient.del(`careplan:${carePlan._id}`);

  res.status(201).json({
    message: "Care plan created successfully",
    data: { carePlan },
  });
};

// Get all care plans based on user role
export const getCarePlans = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new AppError("Authentication required", 401);
    }

    // Check Redis cache
    const cacheKey = `careplans:${userId}:${role}`;
    const cachedCarePlans = await redisClient.get(cacheKey);
    if (cachedCarePlans) {
      logger.info(`Cache hit for careplans:${userId}:${role}`);
      res.status(200).json({ carePlans: JSON.parse(cachedCarePlans) });
      return;
    }

    let carePlans: ICarePlan[];

    if (role === "admin") {
      carePlans = await CarePlan.find()
        .populate("userId", "name email")
        .populate("tasks.assignedTo", "name email");
    } else if (role === "family_member") {
      carePlans = await CarePlan.find()
        .populate("userId", "name email")
        .populate("tasks.assignedTo", "name email");
    } else if (role === "caregiver") {
      carePlans = await CarePlan.find({ "tasks.assignedTo": userId })
        .populate("userId", "name email")
        .populate("tasks.assignedTo", "name email");
    } else if (role === "user") {
      carePlans = await CarePlan.find({ userId })
        .populate("userId", "name email")
        .populate("tasks.assignedTo", "name email");
    } else {
      throw new AppError("Unauthorized access", 403);
    }

    // Cache the result
    await redisClient.setex(
      cacheKey,
      300, // 5 minutes TTL
      JSON.stringify(carePlans)
    );
    logger.info(`Cached careplans:${userId}:${role}`);

    res.status(200).json({ carePlans });
  } catch (error) {
    next(error);
  }
};

// Get a specific care plan by ID
export const getCarePlanById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new AppError("Authentication required", 401);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid care plan ID", 400);
    }

    // Check Redis cache
    const cacheKey = `careplan:${id}:${userId}:${role}`;
    const cachedCarePlan = await redisClient.get(cacheKey);
    if (cachedCarePlan) {
      logger.info(`Cache hit for careplan:${id}:${userId}:${role}`);
      res.status(200).json({ carePlan: JSON.parse(cachedCarePlan) });
      return;
    }

    const carePlan = await CarePlan.findById(id)
      .populate("userId", "name email")
      .populate("tasks.assignedTo", "name email");

    if (!carePlan) {
      throw new AppError("Care plan not found", 404);
    }

    // Access control
    if (role === "admin") {
    } else if (role === "family_member") {
    } else if (role === "caregiver") {
      const hasTask = carePlan.tasks.some(
        (task) => task.assignedTo.toString() === userId.toString()
      );
      if (!hasTask) {
        throw new AppError("You are not assigned to this care plan", 403);
      }
    } else if (role === "user") {
      if (carePlan.userId.toString() !== userId.toString()) {
        throw new AppError("This care plan does not belong to you", 403);
      }
    } else {
      throw new AppError("Unauthorized access", 403);
    }

    // Cache the result
    await redisClient.setex(
      cacheKey,
      300, // 5 minutes TTL
      JSON.stringify(carePlan)
    );
    logger.info(`Cached careplan:${id}:${userId}:${role}`);

    res.status(200).json({ carePlan });
  } catch (error) {
    next(error);
  }
};

// Update care plan (family_member or admin)
export const updateCarePlan = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { userId, title, tasks } = req.body;
  const creatorRole = req?.user?.role;

  if (!creatorRole || !["family_member", "admin"].includes(creatorRole)) {
    throw new AppError(
      "Only family members or admins can update care plans",
      403
    );
  }

  const carePlan = await CarePlan.findById(id);
  if (!carePlan) {
    throw new AppError("Care plan not found", 404);
  }

  carePlan.userId = userId || carePlan.userId;
  carePlan.title = title || carePlan.title;
  carePlan.tasks = tasks || carePlan.tasks;
  await carePlan.save();

  // Create notifications for new or reassigned tasks
  const notificationPromises = [];
  if (tasks) {
    for (const task of tasks) {
      const existingTask = carePlan.tasks.find(
        (t) => t._id.toString() === task._id
      );
      if (
        !existingTask ||
        existingTask.assignedTo.toString() !== task.assignedTo
      ) {
        notificationPromises.push(
          new Notification({
            userId: task.assignedTo,
            message: `Task "${task.taskName}" assigned to you in care plan "${title}"`,
            type: "task_assigned",
            carePlanId: carePlan._id,
            taskId: task._id,
            relatedEntity: { type: "CarePlan", id: carePlan._id },
          }).save()
        );
      }
    }
  }
  const notifications = await Promise.all(notificationPromises);

  // Emit events via Socket.IO
  io.emit("careplan:updated", { carePlan });
  for (const notification of notifications) {
    io.to(notification.userId.toString()).emit(notification.type, {
      notificationId: notification._id,
      userId: notification.userId,
      message: notification.message,
      carePlanId: notification.carePlanId,
      taskId: notification.taskId,
      relatedEntity: notification.relatedEntity,
    });
    logger.info(`Emitted ${notification.type} to user ${notification.userId}`);
  }

  // Invalidate cache
  await redisClient.del(`careplan:${id}`);
  await redisClient.del(`careplans:${userId}`);
  await redisClient.del(`careplans:${carePlan.userId}`);

  res.status(200).json({
    message: "Care plan updated successfully",
    data: { carePlan },
  });
};

// Update task status (caregiver or admin)
export const updateTaskStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, taskId } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new AppError("Authentication required", 401);
    }

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(taskId)) {
      throw new AppError("Invalid care plan or task ID", 400);
    }

    const carePlan = await CarePlan.findById(id);
    if (!carePlan) {
      throw new AppError("Care plan not found", 404);
    }

    const task = carePlan.tasks.id(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Only admin or the assigned caregiver can update task status
    if (role !== "admin" && task.assignedTo.toString() !== userId.toString()) {
      throw new AppError("You are not authorized to update this task", 403);
    }

    if (!["Pending", "Completed", "In Progress"].includes(status)) {
      throw new AppError("Invalid task status", 400);
    }

    task.status = status;
    await carePlan.save();

    // Emit event via Socket.IO
    io.to(carePlan.userId.toString()).emit("task:updated", {
      carePlanId: carePlan._id,
      taskId: task._id,
      status,
    });
    logger.info(`Emitted task:updated to user ${carePlan.userId}`);

    // Invalidate cache
    await redisClient.del(`careplan:${id}`);
    await redisClient.del(`careplans:${userId}`);
    await redisClient.del(`careplans:${carePlan.userId}`);

    res.status(200).json({
      message: "Task status updated successfully",
      task: {
        taskName: task.taskName,
        assignedTo: task.assignedTo,
        status: task.status,
        dueDate: task.dueDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a care plan (family_member or admin)
export const deleteCarePlan = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;
    const userId = req.user?.userId;

    if (!req.user || !role) {
      throw new AppError("Authentication required", 401);
    }

    if (!["family_member", "admin"].includes(role)) {
      throw new AppError(
        "Only family members or admins can delete care plans",
        403
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid care plan ID", 400);
    }

    const carePlan = await CarePlan.findByIdAndDelete(id);
    if (!carePlan) {
      throw new AppError("Care plan not found", 404);
    }

    // Emit event via Socket.IO
    io.emit("careplan:deleted", { carePlanId: id });
    logger.info(`Emitted careplan:deleted for carePlanId ${id}`);

    // Invalidate cache
    await redisClient.del(`careplan:${id}`);
    await redisClient.del(`careplans:${userId}`);
    await redisClient.del(`careplans:${carePlan.userId}`);

    res.status(200).json({ message: "Care plan deleted successfully" });
  } catch (error) {
    next(error);
  }
};
