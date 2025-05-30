// // event-publisher.ts

// import { redisClient } from "./redis-client.js";
// import { io } from "./socket-service.js";
// import dotenv from "dotenv";
// import { logger } from "../utils/logger.js";

// dotenv.config();

// const channel = process.env.REDIS_CHANNEL || "caregiving-updates";

// export const publishEvent = async (event: string, data: any) => {
//   try {
//     await redisClient.publish(channel, JSON.stringify({ event, data }));
//     logger.info(`Published event: ${event} with data: ${JSON.stringify(data)}`);
//   } catch (error) {
//     logger.error("Redis Publish Error:", error);
//   }
// };

// redisClient.subscribe(channel, (err, count) => {
//   if (err) {
//     logger.error("Failed to subscribe: ", err.message);
//   } else {
//     logger.info(`Subscribed to ${count} channel(s).`);
//   }
// });

// redisClient.on("message", (channel, message) => {
//   try {
//     const { event, data } = JSON.parse(message);
//     if (data.userId) {
//       // Emit to specific user's room
//       io.to(data.userId).emit(event, data);
//       logger.info(`Emitted ${event} to user ${data.userId}`);
//     } else {
//       // Fallback to broadcast if no userId
//       io.emit(event, data);
//       logger.info(`Broadcasted ${event} to all clients`);
//     }
//   } catch (error) {
//     logger.error("Error processing Redis message:", error);
//   }
// });
