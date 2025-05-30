import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  carePlanId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  carePlanId: {
    type: Schema.Types.ObjectId,
    ref: "CarePlan",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;