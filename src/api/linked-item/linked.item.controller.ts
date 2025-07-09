import { linkedItemService } from "./linked.item.service";
import { Request, Response, NextFunction } from "express";
import { User } from "../user/user.entity";
import { UserModel } from "../user/user.model";
import { linkedItemModel } from "./linked.item.model";
import { TypedRequest } from "../../utils/typed-request.interface";
import userService from "../user/user.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userIdA, userIdB } = req.body;

    if (!userIdA || !userIdB) {
      return res.status(400).json({ message: "Missing userIdA or userIdB" });
    }

    const userA = await UserModel.findById(userIdA);
    const userB = await UserModel.findById(userIdB);
    if (!userA || !userB) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    const existingLinkedItem = await linkedItemModel.findOne({
      userIdA,
      userIdB,
    });
    if (existingLinkedItem) {
      return res
        .status(400)
        .json({ message: "These users are already linked" });
    }

    // Creazione
    const newLinkedItem = await linkedItemService.create(req.user!, {
      userIdA,
      userIdB,
    });

    res.status(201).json(newLinkedItem);
  } catch (err) {
    next(err);
  }
};

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

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // Assumiamo che `req.user` sia stato valorizzato da un middleware auth
    const user = req.user as User;

    const updated = await linkedItemService.update(user, id, updateData);

    if (!updated) {
      return res
        .status(403)
        .json({ message: "Non autorizzato o elemento non trovato." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Errore nel controller:", error);
    return res.status(500).json({ message: "Errore del server." });
  }
};

export const remove = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const linkedItemId = req.params.id;
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete linked items" });
    }

    const deleted = await linkedItemService.remove(user, linkedItemId);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Linked item not found or already deleted" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
