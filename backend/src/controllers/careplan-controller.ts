import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../middlewares/error-middleware.js";
import CarePlan from "../models/careplan-model.js";
import { CustomRequest } from "../types/user.js";

export const createCarePlan = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { title, tasks } = req.body;

        const newPlan = await CarePlan.create({
            userId: req.user?.userId,
            title,
            tasks,
        });

        res.status(201).json({ message: "Care Plan created successfully", carePlan: newPlan });
    } catch (error) {
        next(error);
    }
};

export const getAllCarePlans = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const plans = await CarePlan.find({ userId: req.user?.userId }).populate("tasks.assignedTo", "name role");

        res.status(200).json(plans);
    } catch (error) {
        next(error);
    }
};

export const getCarePlanById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid Care Plan ID", 400);

        const carePlan = await CarePlan.findOne({ _id: id, userId: req.user?.userId }).populate("tasks.assignedTo", "name role");

        if (!carePlan) throw new AppError("Care Plan not found", 404);

        res.status(200).json(carePlan);
    } catch (error) {
        next(error);
    }
};

export const updateCarePlan = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, tasks } = req.body;

        if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid Care Plan ID", 400);

        const updatedPlan = await CarePlan.findOneAndUpdate(
            { _id: id, userId: req.user?.userId },
            { title, tasks },
            { new: true }
        );

        if (!updatedPlan) throw new AppError("Care Plan not found or unauthorized", 404);

        res.status(200).json({ message: "Care Plan updated", carePlan: updatedPlan });
    } catch (error) {
        next(error);
    }
};

export const deleteCarePlan = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) throw new AppError("Invalid Care Plan ID", 400);

        const deleted = await CarePlan.findOneAndDelete({ _id: id, userId: req.user?.userId });

        if (!deleted) throw new AppError("Care Plan not found or unauthorized", 404);

        res.status(200).json({ message: "Care Plan deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { carePlanId, taskId } = req.params;
        const { status } = req.body;

        if (!Types.ObjectId.isValid(carePlanId) || !Types.ObjectId.isValid(taskId)) {
            throw new AppError("Invalid IDs", 400);
        }

        const carePlan = await CarePlan.findOne({ _id: carePlanId, userId: req.user?.userId });

        if (!carePlan) throw new AppError("Care Plan not found or unauthorized", 404);

        const task = carePlan.tasks.id(taskId);
        if (!task) throw new AppError("Task not found", 404);

        task.status = status;
        await carePlan.save();

        res.status(200).json({ message: "Task status updated", task });
    } catch (error) {
        next(error);
    }
};
