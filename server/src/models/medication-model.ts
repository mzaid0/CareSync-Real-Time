import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMedication extends Document {
  userId: Types.ObjectId;
  medicineName: string;
  dosage: string;
  time: string[];
  frequency: "Daily" | "Weekly" | "Monthly";
  status?: "Pending" | "Taken" | "Missed";
  createdAt?: Date;
  updatedAt?: Date;
}

const medicationSchema = new Schema<IMedication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
    },
    time: {
      type: [String],
      required: [true, "Time schedule is required"],
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: [true, "Frequency is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Taken", "Missed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Medication = mongoose.model<IMedication>("Medication", medicationSchema);
export default Medication;
