import { User } from "../user/user.entity";
import { LinkedItem } from "./linked.item.entity";
import { linkedItemModel } from "./linked.item.model";

export class LinkedItemService {
  async create(user: User, data: Partial<LinkedItem>): Promise<LinkedItem> {
    if (user.role !== "admin") {
      throw new Error("Only admin users can create matches");
    }

    const { userIdA, userIdB, scoreA = 0, scoreB = 0 } = data;

    if (!userIdA || !userIdB) {
      throw new Error("userIdA and userIdB are required");
    }

    if (scoreA < 0 || scoreB < 0) {
      throw new Error("Scores must be non-negative");
    }

    // Verifica se esiste già un collegamento tra questi due utenti
    const existing = await linkedItemModel.findOne({
      $or: [
        { userIdA, userIdB },
        { userIdA: userIdB, userIdB: userIdA }, // controllo invertito
      ],
    });

    if (existing) {
      throw new Error("A linked item between these two users already exists");
    }

    const newLinkedItem = {
      userIdA,
      userIdB,
      isPlayed: data.isPlayed ?? false,
      scoreA,
      scoreB,
      date: new Date(),
    };

    return await linkedItemModel.create(newLinkedItem);
  }

  async list(user: User): Promise<LinkedItem[]> {
    if (user.role === "admin") {
      return await linkedItemModel.find();
    }

    return await linkedItemModel.find({
      $or: [{ userIdA: user.id }, { userIdB: user.id }],
    });
  }

  async findOne(user: User, id: string): Promise<LinkedItem | null> {
    const linkedItem = await linkedItemModel.findById(id);
    if (!linkedItem) return null;

    const isAuthorized =
      user.role === "admin" ||
      linkedItem.userIdA.toString() === user.id ||
      linkedItem.userIdB.toString() === user.id;

    return isAuthorized ? linkedItem : null;
  }

  async update(
    user: User,
    id: string,
    updateData: Partial<LinkedItem>
  ): Promise<LinkedItem | null> {
    const linkedItem = await linkedItemModel.findById(id);
    if (!linkedItem) return null;

    const isAuthorized =
      user.role === "admin" ||
      linkedItem.userIdA.toString() === user.id ||
      linkedItem.userIdB.toString() === user.id;

    if (!isAuthorized) return null;

    return await linkedItemModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

async remove(user: User, id: string): Promise<boolean> {
  if (user.role !== "admin") return false;

  const result = await linkedItemModel.deleteOne({ _id: id });
  return result.deletedCount > 0;
}


  async getSingleEventSubs(eventId: string): Promise<LinkedItem[]> {
    const linkedItems = await linkedItemModel
      .find({ baseItemId: eventId })
      .populate("userIdA", "firstName lastName")
      .populate("userIdB", "firstName lastName");

    if (!linkedItems || linkedItems.length === 0) {
      throw new Error("No linked items found for this event");
    }

    return linkedItems;
  }
}

export const linkedItemService = new LinkedItemService();
