import mongoose from "mongoose";
import { LinkedItem } from "./linked.item.entity";

const linkedItemSchema = new mongoose.Schema<LinkedItem>({
  date: { type: Date, default: Date.now },
  userIdA: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userIdB: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPlayed: { type: Boolean, required: true },
  scoreA: { type: Number },
  scoreB: { type: Number }
});

linkedItemSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

linkedItemSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const linkedItemModel = mongoose.model<LinkedItem>("linked-item", linkedItemSchema);
