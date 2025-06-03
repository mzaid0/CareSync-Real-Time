// socket-service.ts
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { logger } from "../utils/logger.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  logger.info(`🔗 New client connected: ${socket.id}`);

  socket.on("join", (userId: string) => {
    if (userId) {
      socket.join(userId);
      logger.info(`✅ Client ${socket.id} joined room: ${userId}`);
    }
  });

  socket.on("disconnect", () => {
    logger.info(`❌ Client disconnected: ${socket.id}`);
  });

  socket.on("error", (err) => {
    logger.error(`⚠️ Socket error from ${socket.id}:`, err);
  });
});

io.engine.on("connection_error", (err) => {
  logger.error("❌ Socket.IO connection error:", err.message);
});

logger.info("✅ Socket.IO initialized");

export { app, httpServer, io };
