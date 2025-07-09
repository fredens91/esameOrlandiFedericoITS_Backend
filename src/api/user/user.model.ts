import mongoose from "mongoose";
import { User } from "./user.entity";

export const userSchema = new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isSubscribed: { type: Boolean, default: false }
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // nascondi la password in output
    return ret;
  }
});

userSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // nascondi la password anche in .toObject()
    return ret;
  }
});

export const UserModel = mongoose.model<User>("User", userSchema);
