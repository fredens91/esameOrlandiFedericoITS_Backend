import { User } from "../user/user.entity";
import { BaseItem } from "../base-item/base.item.entity";

export interface LinkedItem {
    id?: string;
    adminAction?: string;
    date?: Date;
    userId: User;
    baseItemId: BaseItem;
}