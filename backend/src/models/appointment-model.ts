import mongoose, { Schema, model } from "mongoose";

const appointmentSchema = new Schema<IAppointment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        doctorName: {
            type: String,
            required: [true, "Doctor name is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            validate: {
                validator: (v: Date) => v.getTime() >= new Date().getTime(),
                message: "Date cannot be in the past",
            },
        },
        status: {
            type: String,
            enum: ["Scheduled", "Completed", "Cancelled"],
            default: "Scheduled",
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
