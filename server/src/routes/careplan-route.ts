import { Router } from "express";
import {
  createCarePlan,
  getCarePlans,
  getCarePlanById,
  updateCarePlan,
  updateTaskStatus,
  deleteCarePlan,
} from "../controllers/careplan-controller.js";
import {
  validateCreateCarePlan,
  validateGetCarePlanById,
  validateUpdateCarePlan,
  validateUpdateTaskStatus,
  validateDeleteCarePlan,
} from "../validator/careplan-validator.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import rateLimit from "express-rate-limit";
import { RedisStore, type SendCommandFn } from "rate-limit-redis";
import { redisClient } from "../services/redis-client.js";

const router = Router();

// Middleware: Auth check for all routes
router.use(authenticateToken);

// Strict rate limiter for sensitive routes (create, delete)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Allow only 10 requests per 15 mins
  store: new RedisStore({
    sendCommand: ((...args: [string, ...(string | number | Buffer)[]]) =>
      redisClient.call(...args) as ReturnType<SendCommandFn>) as SendCommandFn,
    prefix: "rate-limit:strict:",
  }),
});

// Routes
router.post("/", strictLimiter, validateCreateCarePlan, createCarePlan);
router.get("/", getCarePlans);
router.get("/:id", validateGetCarePlanById, getCarePlanById);
router.put("/:id", validateUpdateCarePlan, updateCarePlan);
router.put("/:id/tasks/:taskId", validateUpdateTaskStatus, updateTaskStatus);
router.delete("/:id", strictLimiter, validateDeleteCarePlan, deleteCarePlan);

export default router;
