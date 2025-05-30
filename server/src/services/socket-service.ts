// socket-service.ts
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import { Express } from "express";
import { logger } from "../utils/logger.js";

let io: Server;

export const startSocketServer = (app: Express, port: number): HttpServer => {
  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,  
    },
  });

  io.on("connection", (socket) => {
    logger.info(`🔗 New client connected: ${socket.id}`);

    // Join a room based on userId
    socket.on("join", (userId: string) => {
      if (userId) {
        socket.join(userId);
        logger.info(`Client ${socket.id} joined room: ${userId}`);
      }
    });

    socket.on("disconnect", () => {
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    logger.info(`🚀 Socket.IO server running on http://localhost:${port}`);
  });

  return httpServer;
};

export { io };
