import { model, Schema } from "mongoose";
import { ICarePlan, ITask } from "../types/careplan.js";

const taskSchema = new Schema<ITask>({
    taskName: {
        type: String,
        required: [true, "Task name is required"],
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Assigned user is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "In Progress"],
        default: "Pending",
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    },
});

const carePlanSchema = new Schema<ICarePlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        tasks: [taskSchema],
    },
    {
        timestamps: true,
    }
);

const CarePlan = model<ICarePlan>("CarePlan", carePlanSchema);

export default CarePlan;
