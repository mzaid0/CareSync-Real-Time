import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFile extends Document {
  userId: Types.ObjectId;
  fileType: string;
  url: string;
  permissions: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const fileSchema = new Schema<IFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
    },
    url: {
      type: String,
      required: [true, "File URL is required"],
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model<IFile>("File", fileSchema);

export default File;
