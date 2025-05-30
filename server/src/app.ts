import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import userRoutes from "./routes/user-route.js";
import carePlanRoutes from "./routes/careplan-route.js";
import { logger } from "./utils/logger.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import cookieParser from "cookie-parser";
import notificationRoutes from "./routes/notification-route.js";
import { redisClient } from "./services/redis-client.js";
import type { SendCommandFn } from 'rate-limit-redis';

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

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: (req, res) => {
//     logger.warn(`Rate limit reached for IP ${req.ip}`);
//     res.status(429).json({
//       success: false,
//       message: "Too many requests, please try again later",
//     });
//   },
//   store: new RedisStore({
//     // Fix TypeScript error by explicitly defining args as a tuple and casting return type
//     sendCommand: ((...args: [string, ...(string | number | Buffer)[]]) =>
//       redisClient.call(...args) as Promise<import('rate-limit-redis').RedisReply>
//     ) as SendCommandFn,
//     prefix: "rate-limit:",
//   }),
// });
// app.use(limiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/care-plans", carePlanRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  logger.info("Collaborative Caregiving Planner API is running");
  res.send("Collaborative Caregiving Planner API is running");
});

app.use(errorMiddleware);

export default app;
