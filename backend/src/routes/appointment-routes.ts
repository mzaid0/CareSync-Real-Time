import { Router } from "express";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
} from "../controllers/appointment-controller.js";
import {
    validateCreateAppointment,
    validateGetAppointmentById,
    validateUpdateAppointment,
    validateDeleteAppointment,
} from "../validator/appointment-validator.js";

const router = Router();

router.post("/", authenticateToken, validateCreateAppointment, createAppointment);
router.get("/", authenticateToken, getAppointments);
router.get("/:id", authenticateToken, validateGetAppointmentById, getAppointmentById);
router.put("/:id", authenticateToken, validateUpdateAppointment, updateAppointment);
router.delete("/:id", authenticateToken, validateDeleteAppointment, deleteAppointment);

export default router;
