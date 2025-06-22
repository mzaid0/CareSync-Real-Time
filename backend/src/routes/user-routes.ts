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

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", authenticateToken, logout);
router.get("/", authenticateToken, getUsers);

export default router;
