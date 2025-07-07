import { BaseItemModel } from "../base-item/base.item.model";
import { User } from "../user/user.entity";
import { LinkedItem } from "./linked.item.entity";
import { linkedItemModel } from "./linked.item.model";

export class LinkedItemService {
  async list(user: User): Promise<LinkedItem[]> {
    if (user.role === "admin") {
      return await linkedItemModel.find().populate("baseItemId"); // <--- qui
    }

    return await linkedItemModel
      .find({ userId: user.id })
      .populate("baseItemId");
  }

  async findOne(user: User, id: string): Promise<LinkedItem | null> {
    const linkedItem = await linkedItemModel.findById(id);
    if (!linkedItem) return null;

    if (user.role === "admin" || linkedItem.userId.toString() === user.id) {
      return linkedItem;
    }

    return null;
  }

  async create(linkedItem: Partial<LinkedItem>): Promise<LinkedItem> {
    const newLinkedItemData = {
      userId: linkedItem.userId,
      baseItemId: linkedItem.baseItemId,
      adminAction: linkedItem.adminAction ?? "none",
      date: new Date(),
    };

    return await linkedItemModel.create(newLinkedItemData);
  }

  async adminAction(
    user: User,
    id: string,
    updateData: Partial<LinkedItem>
  ): Promise<LinkedItem | null> {
    const linkedItem = await linkedItemModel.findById(id);
    if (!linkedItem) return null;

    if (user.role !== "admin" && linkedItem.userId.toString() !== user.id) {
      return null;
    }

    return await linkedItemModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  // CUSTOM

async getSingleEventSubs(eventId: string): Promise<LinkedItem[]> {
  const linkedItems = await linkedItemModel
    .find({ baseItemId: eventId })
    .populate('userId', 'firstName lastName'); // <-- Popola solo questi campi

  if (!linkedItems || linkedItems.length === 0) {
    throw new Error('No linked items found for this event');
  }

  return linkedItems;
}


  // async update(user: User, id: string, updateData: Partial<LinkedItem>): Promise<LinkedItem | null> {
  //   const linkedItem = await linkedItemModel.findById(id);
  //   if (!linkedItem) return null;

  //   if (user.role !== "admin" && linkedItem.userId.toString() !== user.id) {
  //     return null;
  //   }

  //   return await linkedItemModel.findByIdAndUpdate(
  //     id,
  //     { $set: updateData },
  //     { new: true }
  //   );
  // }

  async remove(user: User, id: string): Promise<boolean> {
    const linkedItem = await linkedItemModel.findById(id);
    if (!linkedItem) return false;

    // Solo il proprietario può cancellare
    if (linkedItem.userId.toString() !== user.id) {
      return false;
    }

    // Recupera il baseItem associato
    const baseItem = await BaseItemModel.findById(linkedItem.baseItemId);
    if (!baseItem) return false;

    // Controllo: se baseItem.date è oggi, blocca la cancellazione
    const today = new Date();
    const isSameDate =
      baseItem.date.getFullYear() === today.getFullYear() &&
      baseItem.date.getMonth() === today.getMonth() &&
      baseItem.date.getDate() === today.getDate();

    if (isSameDate) {
      return false; // Non si può cancellare
    }

    const result = await linkedItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // async actionByAdmin(user: User, id: string): Promise<LinkedItem | null> {
  //   if (user.role !== "admin") {
  //     throw new Error(
  //       "Unauthorized action. Only admins can perform this action."
  //     );
  //   }

  //   const linkedItem = await linkedItemModel.findById(id);
  //   if (!linkedItem) {
  //     throw new Error("Linked item not found");
  //   }

  //   linkedItem.adminAction = "checked";
  //   linkedItem.date = new Date();

  //   await linkedItem.save();

  //   return linkedItem;
  // }
}

export const linkedItemService = new LinkedItemService();
