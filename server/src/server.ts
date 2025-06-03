// server.ts
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { redisClient } from "./services/redis-client.js";
import { logger } from "./utils/logger.js";
import { startTaskReminderCron } from "./utils/task-reminder.js";
import carePlanRoutes from "./routes/careplan-route.js";
import notificationRoutes from "./routes/notification-route.js";
import userRoutes from "./routes/user-route.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { app, httpServer } from "./services/socket-service.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      })
    );
    app.use(helmet());
    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/users", userRoutes);
    app.use("/api/care-plans", carePlanRoutes);
    app.use("/api/notifications", notificationRoutes);
    app.use(errorMiddleware);

    redisClient.ping((err, result) => {
      if (err) {
        logger.error("❌ Redis connection error:", err.message);
      } else {
        logger.info(`✅ Redis connected: ${result}`);
      }
    });

    startTaskReminderCron();

    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
