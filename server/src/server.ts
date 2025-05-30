// server.ts
import app from "./app.js";
import { logger } from "./utils/logger.js";
import { startSocketServer } from "./services/socket-service.js";
import { redisClient } from "./services/redis-client.js";
import { startTaskReminderCron } from "./utils/task-reminder.js";
import { connectDB } from "./config/db.js";

startTaskReminderCron();

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5001;

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
