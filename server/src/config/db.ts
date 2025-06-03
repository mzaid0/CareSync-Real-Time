// config/db.ts
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

mongoose.connection.on("connected", () => {
  logger.info("✅ MongoDB connected successfully");
});

mongoose.connection.on("error", (error) => {
  logger.error("❌ MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB disconnected");
});
export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
};
