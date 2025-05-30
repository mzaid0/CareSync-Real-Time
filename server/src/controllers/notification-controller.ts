import { NextFunction, Response } from "express";
import { AppError } from "../middlewares/error-middleware.js";
import { Notification } from "../models/notification-model.js";
import { io } from "../services/socket-service.js";
import { CustomRequest } from "../types/user.js";
import { logger } from "../utils/logger.js";

// GET /notifications
export const getNotifications = async (req: CustomRequest, res: Response) => {
  const userId = req?.user?.userId;
  const notifications = await Notification.find({ userId })
    .populate("carePlanId", "title")
    .sort({ createdAt: -1 });
  res.status(200).json({
    message: "Notifications fetched successfully",
    data: { notifications },
  });
};

// PATCH /notifications/:id/read
export const markNotificationAsRead = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Authentication required", 401);

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) throw new AppError("Notification not found", 404);

    // Emit event via Socket.IO
    io.to(userId.toString()).emit("notification:read", {
      notificationId: id,
      userId,
    });
    logger.info(`Emitted notification:read to user ${userId}`);

    res.status(200).json({
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /notifications/:id
export const deleteNotification = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.userId;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    userId,
  });
  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (!userId) throw new AppError("Authentication required", 401);

  io.to(userId.toString()).emit("notification:deleted", {
    notificationId: id,
    userId: userId.toString(),
  });

  logger.info(`Emitted notification:deleted to user ${userId}`);

  res.status(200).json({ message: "Notification deleted" });
};
