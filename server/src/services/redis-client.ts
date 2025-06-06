import Redis from "ioredis";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
export const redisClient = new Redis(redisUrl);

redisClient.on("connect", () => {
  logger.info("✅ Redis connected successfully");
});
redisClient.on("error", (err) => {
  logger.error("❌ Redis connection error:", err.message);
});
