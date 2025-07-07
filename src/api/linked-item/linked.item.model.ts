import mongoose from "mongoose";
import { LinkedItem } from "./linked.item.entity";

const linkedItemSchema = new mongoose.Schema<LinkedItem>({
  adminAction: { type: String, required: true },
  date: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  baseItemId: { type: mongoose.Schema.Types.ObjectId, ref: "base-item", required: true },
});

// Configurazioni per la serializzazione
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

// Esportazione del modello Mongoose
export const linkedItemModel = mongoose.model<LinkedItem>("linked-item", linkedItemSchema);
