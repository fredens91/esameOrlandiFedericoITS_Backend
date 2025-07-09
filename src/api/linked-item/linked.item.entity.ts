import { User } from "../user/user.entity";

export interface LinkedItem {
  id?: string;
  date?: Date;
  userIdA: User;
  userIdB: User;
  isPlayed: boolean;
  scoreA?: number;
  scoreB?: number;
}
