import { UserModel } from "./user.model";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { UserExistsError } from "../../errors/user-exist";
import {
  PasswordMismatchError,
  SamePasswrentalror,
} from "../../errors/password";
import { HydratedDocument } from "mongoose";

export class UserService {
  async add(
    user: User,
    credentials: { username: string; password: string }
  ): Promise<User> {
    const existingUser = await UserModel.findOne({
      username: credentials.username,
    });

    if (existingUser) {
      throw new UserExistsError();
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // Imposta "member" se role non è definito o è vuoto
    const role = user.role && user.role.trim() !== "" ? user.role : "member";

    const newUser = await UserModel.create({
      ...user,
      password: hashedPassword,
      role,
    });

    return newUser;
  }

  async list(): Promise<User[]> {
    const userList = await UserModel.find();
    return userList;
  }

  async listSubscribed(): Promise<User[]> {
    const subscribedUsers = await UserModel.find({ isSubscribed: true });
    return subscribedUsers;
  }

  async subscribeToTournament(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Imposta 'isSubscribed' a true
    user.isSubscribed = true;
    await user.save();

    return user;
  }

  async changeRoleToAdmin(userId: string): Promise<User> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("User is already an admin");
  }

  // Cambia il ruolo a "admin"
  user.role = "admin";
  await user.save();

  return user;
}


  async updatePassword(
    user: User,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      throw new PasswordMismatchError();
    }

    const existingUser = await UserModel.findById(user.id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const samePassword = await this._comparePassword(
      newPassword,
      existingUser.password
    );

    if (samePassword) {
      throw new SamePasswrentalror();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return existingUser;
  }

  async _getById(userId: string): Promise<HydratedDocument<User> | null> {
    return await UserModel.findOne({ _id: userId });
  }

  private async _comparePassword(plain: string, hashed: string) {
    return await bcrypt.compare(plain, hashed);
  }

  async remove(userId: string): Promise<void> {
    await UserModel.deleteOne({ _id: userId });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }
}

export default new UserService();
