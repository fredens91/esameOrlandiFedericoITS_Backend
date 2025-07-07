import { Request, Response, NextFunction } from "express";

const name = "EntityAlreadyExistsError";
const message = "Entity already exists";

export class EntityAltadyExistError extends Error {
  name: string = name;
  message: string = message;
  entity: any;
  constructor(entity?: any) {
    super(message);
    this.entity = entity;
  }
}

export const entityAlradyExistHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof EntityAltadyExistError) {
    res.status(409);
    res.json({
      error: err.name,
      message: err.message,
      entity: err.entity,
    });
  } else {
    next(err);
  }
};
