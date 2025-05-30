// notification-route.ts
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import {
    deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification-controller.js";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.put("/:id/read", authenticateToken, markNotificationAsRead);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;
