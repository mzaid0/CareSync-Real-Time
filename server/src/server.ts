import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import carePlanRoutes from "./routes/careplan-route.js";
import notificationRoutes from "./routes/notification-route.js";
import userRoutes from "./routes/user-route.js";
import { redisClient } from "./services/redis-client.js";
import { startSocketServer } from "./services/socket-service.js";
import { logger } from "./utils/logger.js";
import { startTaskReminderCron } from "./utils/task-reminder.js";
dotenv.config();


const app = express();

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

app.get("/", (req, res) => {
  logger.info("Collaborative Caregiving Planner API is running");
  res.send("Collaborative Caregiving Planner API is running");
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    redisClient.ping((err, result) => {
      if (err) {
        logger.error("❌ Redis connection error:", err.message);
      } else {
        logger.info(`✅ Redis is connected and responding: ${result}`);
      }
    });

    startTaskReminderCron();

    const PORT = process.env.PORT || 5000;
    const SOCKET_PORT = process.env.SOCKET_PORT || 5001;

    app.listen(PORT, () => {
      logger.info(`🚀 Express server running on http://localhost:${PORT}`);
    });

    startSocketServer(app, Number(SOCKET_PORT));
  } catch (error) {
    logger.error("❌ Failed to start server", error);
    process.exit(1);
  }
};

startServer();
