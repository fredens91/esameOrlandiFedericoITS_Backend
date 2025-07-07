import { BaseItem } from "./base.item.entity";
import { BaseItemModel } from "./base.item.model";

export class BaseItemService {
  async list(): Promise<BaseItem[]> {
    return await BaseItemModel.find();
  }

  async findOne(id: string): Promise<BaseItem | null> {
    return await BaseItemModel.findById(id);
  }

  async create(baseItem: Omit<BaseItem, "id">): Promise<BaseItem> {
    const newBaseItem = await BaseItemModel.create(baseItem);
    return newBaseItem;
  }

  async update(
    id: string,
    updateData: Partial<BaseItem>
  ): Promise<BaseItem | null> {
    const updatedBaseItem = await BaseItemModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    return updatedBaseItem;
  }

  async remove(id: string): Promise<boolean> {
    const result = await BaseItemModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default new BaseItemService();
