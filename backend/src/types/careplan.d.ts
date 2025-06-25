import mongoose, { Document, Types } from "mongoose";

export interface ITask extends Types.Subdocument {
  _id: Types.ObjectId;
  taskName: string;
  assignedTo: Types.ObjectId;
  status: "Pending" | "Completed" | "In Progress";
  dueDate: Date;
}

export interface ICarePlan extends Document {
  userId: Types.ObjectId;
  title: string;
  tasks: Types.DocumentArray<ITask>;
  createdAt: Date;
  updatedAt: Date;
}
