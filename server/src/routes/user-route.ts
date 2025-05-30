import { Router } from "express";
import {
  register,
  login,
  getUsers,
  logout,
} from "../controllers/user-controller.js";
import {
  validateRegister,
  validateLogin,
} from "../validator/user-validator.js";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import rateLimit from "express-rate-limit";
import { RedisStore, type SendCommandFn } from "rate-limit-redis";
import { redisClient } from "../services/redis-client.js";

const router = Router();

// Rate limiters for login and registration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req) => req.method === "OPTIONS",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, please try again later.",
    });
  },
  store: new RedisStore({
    sendCommand: ((...args: [string, ...(string | number | Buffer)[]]) =>
      redisClient.call(...args) as ReturnType<SendCommandFn>) as SendCommandFn,
    prefix: "rate-limit:login:",
  }),
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req) => req.method === "OPTIONS",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many registration attempts, please try again later.",
    });
  },
  store: new RedisStore({
    sendCommand: ((...args: [string, ...(string | number | Buffer)[]]) =>
      redisClient.call(...args) as ReturnType<SendCommandFn>) as SendCommandFn,
    prefix: "rate-limit:register:",
  }),
});

// Apply rate limiters only to sensitive endpoints
router.post("/register", registerLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);
router.post("/logout", authenticateToken, logout);
router.get("/", authenticateToken, getUsers);

export default router;
