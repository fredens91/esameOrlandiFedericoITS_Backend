import { NextFunction, Response, Request } from "express";
import userService from "./user.service";
import { TypedRequest } from "../../utils/typed-request.interface";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await userService.list();
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json(req.user);
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await userService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, username } = req.body;

    const updatedUser = await userService.updateProfile(userId, {
      firstName,
      lastName,
      username,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
