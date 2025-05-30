// notification-model.ts
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "task_reminder",
        "careplan_added",
        "careplan_updated",
        "task_assigned",
      ],
      required: true,
    },
    carePlanId: { type: Schema.Types.ObjectId, ref: "CarePlan" },
    taskId: { type: String },
    read: { type: Boolean, default: false },
    relatedEntity: {
      type: { type: String, enum: ["CarePlan", "Task"] },
      id: { type: String },
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
