import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEmergencyAlert extends Document {
  userId: Types.ObjectId;
  alertType: "Fall" | "Heart Rate" | "Panic Button" | "Other";
  message: string;
  status: "Pending" | "Resolved";
  createdAt?: Date;
  updatedAt?: Date;
}

const emergencyAlertSchema = new Schema<IEmergencyAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    alertType: {
      type: String,
      enum: ["Fall", "Heart Rate", "Panic Button", "Other"],
      required: [true, "Alert type is required"],
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const EmergencyAlert = mongoose.model<IEmergencyAlert>(
  "EmergencyAlert",
  emergencyAlertSchema
);

export default EmergencyAlert;
