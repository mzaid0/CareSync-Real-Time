import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFamilyLink extends Document {
  familyMemberId: Types.ObjectId;
  patientId: Types.ObjectId;
}

const familyLinkSchema = new Schema<IFamilyLink>({
  familyMemberId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FamilyLink = mongoose.model<IFamilyLink>("FamilyLink", familyLinkSchema);

export default FamilyLink;