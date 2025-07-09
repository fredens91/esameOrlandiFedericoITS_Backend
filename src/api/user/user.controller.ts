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

export const listSubscribed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.listSubscribed();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const subscribeToTournament = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // L'utente corrente

    // Iscrizione al torneo
    const user = await userService.subscribeToTournament(userId!);

    res.status(200).json({
      message: "Iscrizione al torneo avvenuta con successo",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const changeRoleToAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // L'utente corrente

    // Cambia il ruolo a "admin"
    const user = await userService.changeRoleToAdmin(userId!);

    res.status(200).json({
      message: "Ruolo cambiato con successo a 'admin'",
      user,
    });
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
