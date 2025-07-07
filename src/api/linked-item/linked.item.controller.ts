import { linkedItemService } from "./linked.item.service";
import { Request, Response, NextFunction } from "express";
import { BaseItemModel } from "../base-item/base.item.model";
import { linkedItemModel } from "./linked.item.model";
import { TypedRequest } from "../../utils/typed-request.interface";
import { User } from "../user/user.entity";
import { UserModel } from "../user/user.model";

// export const list = async (
//   req: TypedRequest<unknown, User>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const linkedItems = await linkedItemService.list(req.user!);
//     res.status(200).json(linkedItems);
//   } catch (err) {
//     next(err);
//   }
// };

export const list = async (
  req: TypedRequest<unknown, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("✅ req.user:", req.user);
    const linkedItems = await linkedItemService.list(req.user!);
    res.status(200).json(linkedItems);
  } catch (err) {
    console.error("🔥 Errore nel controller:", err);
    next(err);
  }
};


export const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const linkedItem = await linkedItemService.findOne(req.user!, id);

    if (!linkedItem) {
      return res.status(404).send("linked item not found");
    }

    res.status(200).json(linkedItem);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminAction, userId, baseItemId } = req.body;

    if (!userId || !baseItemId) {
      return res.status(400).json({ message: "Missing userId or baseItemId" });
    }

    const baseItem = await BaseItemModel.findById(baseItemId);
    if (!baseItem) {
      return res.status(404).json({ message: "Base item not found" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingLinkedItem = await linkedItemModel.findOne({
      userId,
      baseItemId,
    });
    if (existingLinkedItem) {
      return res
        .status(400)
        .json({ message: "User has already linked this item" });
    }

    const now = new Date();
    if (now >= baseItem.date) {
      return res.status(400).json({ message: "Too late to link this item" });
    }

    // Creazione
    const newLinkedItem = await linkedItemService.create({
      userId,
      baseItemId,
      adminAction,
    });

    res.status(201).json(newLinkedItem);
  } catch (err) {
    next(err);
  }
};

export const adminAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkedItemId = req.params.id;
    const { adminAction, date, userId, baseItemId } = req.body;
    const user = req.user!;
    const baseItem = await BaseItemModel.findById(baseItemId); // Usa BaseItemModel qui

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!baseItem) {
      return res.status(404).json({ message: "Base item not found" });
    }

    const userIdToSave = typeof userId === "object" ? userId.id : userId;
    const baseItemIdToSave =
      typeof baseItemId === "object" ? baseItemId.id : baseItemId;

    const updatedLinkedItem = await linkedItemService.adminAction(
      user,
      linkedItemId,
      {
        adminAction,
        date,
        userId: userIdToSave,
        baseItemId: baseItemIdToSave,
      }
    );

    if (!updatedLinkedItem) {
      return res.status(404).send("linked item not found");
    }

    res.status(200).json(updatedLinkedItem);
  } catch (err) {
    next(err);
  }
};

export const getSingleEventSubs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const baseItemId = req.params.baseItemId;

    if (!baseItemId) {
      return res.status(400).json({ message: "Missing baseItemId parameter" });
    }

    const subscriptions = await linkedItemService.getSingleEventSubs(
      baseItemId
    );

    res.status(200).json(subscriptions);
  } catch (err) {
    next(err);
  }
};

// export const update = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const linkedItemId = req.params.id;
//     const { isAdminAction, date, userId, baseItemId } = req.body;
//     const user = req.user!;
//     const baseItem = await BaseItemModel.findById(baseItemId);  // Usa BaseItemModel qui

//     if (!user) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }
//     if (!baseItem) {
//       return res.status(404).json({ message: "Base item not found" });
//     }

//     const userIdToSave = typeof userId === 'object' ? userId.id : userId;
//     const baseItemIdToSave = typeof baseItemId === 'object' ? baseItemId.id : baseItemId;

//     const updatedLinkedItem = await linkedItemService.update(user, linkedItemId, {
//       isAdminAction,
//       date,
//       userId: userIdToSave,
//       baseItemId: baseItemIdToSave,
//     });

//     if (!updatedLinkedItem) {
//       return res.status(404).send("linked item not found");
//     }

//     res.status(200).json(updatedLinkedItem);
//   } catch (err) {
//     next(err);
//   }
// };

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkedItemId = req.params.id;
    const user = req.user!;

    const linkedItem = await linkedItemModel.findById(linkedItemId);
    if (!linkedItem) {
      return res.status(404).json({ message: "Linked item not found" });
    }

    if (linkedItem.userId.toString() !== user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this item" });
    }

    const baseItem = await BaseItemModel.findById(linkedItem.baseItemId);
    if (!baseItem) {
      return res.status(404).json({ message: "Base item not found" });
    }

    const today = new Date();
    const isSameDate =
      baseItem.date.getFullYear() === today.getFullYear() &&
      baseItem.date.getMonth() === today.getMonth() &&
      baseItem.date.getDate() === today.getDate();

    if (isSameDate) {
      return res.status(400).json({
        message: "You cannot delete a linked item scheduled for today",
      });
    }

    const deleted = await linkedItemService.remove(user, linkedItemId);
    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete linked item" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
