import { Router } from "express";
import { authenticateToken } from "../middlewares/auth-middleware.js";
import {
    createCarePlan,
    getAllCarePlans,
    getCarePlanById,
    updateCarePlan,
    deleteCarePlan,
    updateTaskStatus,
} from "../controllers/careplan-controller.js";
import {
    validateCreateCarePlan,
    validateGetCarePlanById,
    validateUpdateCarePlan,
    validateDeleteCarePlan,
    validateUpdateTaskStatus,
} from "../validator/careplan-validator.js"

const router = Router();

router.post("/", authenticateToken, validateCreateCarePlan, createCarePlan);
router.get("/", authenticateToken, getAllCarePlans);
router.get("/:id", authenticateToken, validateGetCarePlanById, getCarePlanById);
router.put("/:id", authenticateToken, validateUpdateCarePlan, updateCarePlan);
router.delete("/:id", authenticateToken, validateDeleteCarePlan, deleteCarePlan);
router.patch(
    "/:carePlanId/tasks/:taskId/status",
    authenticateToken,
    validateUpdateTaskStatus,
    updateTaskStatus
);

export default router;
