import { NextFunction, Request, Response } from "express";
import baseItemService from "./base.item.service";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseItem = await baseItemService.list();
    res.status(200).json(baseItem);
  } catch (err) {
    next(err);
  }
};

export const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const baseItem = await baseItemService.findOne(id);

    if (!baseItem) {
      return res.status(404).send("Base item not found");
    }

    res.status(200).json(baseItem);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, date } = req.body;
    const newBaseItem = await baseItemService.create({ title, description, date });
    res.status(201).json(newBaseItem);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseItemId = req.params.id;
    const { title, description, date } = req.body;

    const updatedBaseItem = await baseItemService.update(baseItemId, {
      title,
      description,
      date,
    });

    if (!updatedBaseItem) {
      return res.status(404).send("Base item not found");
    }

    res.status(200).json(updatedBaseItem);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseItemId = req.params.id;
    const deleted = await baseItemService.remove(baseItemId);

    if (!deleted) {
      return res.status(404).send("Base item not found");
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
