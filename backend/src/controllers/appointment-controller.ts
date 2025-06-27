import { NextFunction, Response } from "express";
import Appointment from "../models/appointment-model.js";
import { CustomRequest } from "../types/user.js";
import mongoose from "mongoose";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const createAppointment = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { doctorName, location, time, date } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const newAppointment = await Appointment.create({
            userId,
            doctorName,
            location,
            time,
            date
        });

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: newAppointment
        });
    } catch (error) {
        next(error);
    }
};

export const getAppointments = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const appointments = await Appointment.find({ userId }).sort({ date: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        next(error);
    }
};

export const getAppointmentById = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!isValidId(id)) {
            res.status(400).json({ message: "Invalid appointment ID" });
            return;
        }

        const appointment = await Appointment.findOne({ _id: id, userId });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const updateAppointment = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { doctorName, location, time, date, status } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!isValidId(id)) {
            res.status(400).json({ message: "Invalid appointment ID" });
            return;
        }

        const allowedStatuses = ["Scheduled", "Completed", "Cancelled"];
        if (status && !allowedStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, userId },
            { doctorName, location, time, date, status },
            { new: true, runValidators: true }
        );

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAppointment = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!isValidId(id)) {
            res.status(400).json({ message: "Invalid appointment ID" });
            return;
        }

        const appointment = await Appointment.findOneAndDelete({ _id: id, userId });

        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        next(error);
    }
};
