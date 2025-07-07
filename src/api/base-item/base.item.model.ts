import mongoose from "mongoose";
import { BaseItem } from "./base.item.entity";
import { userSchema } from "../user/user.model";
import { subscribe } from "diagnostics_channel";

// Definizione dello schema per il modello BaseItem
const baseItemSchema = new mongoose.Schema<BaseItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },  // Cambiato da String a Date
});

// Configurazioni per la serializzazione
baseItemSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

baseItemSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Esportazione del modello Mongoose
export const BaseItemModel = mongoose.model<BaseItem>("base-items", baseItemSchema);
