// config/db.ts
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("✅ Database connected successfully");
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB", error);
    throw error;
  }
};
