import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
  collectionName?: string;
  constructor(collectionName?: string) {
    super("Entity not found");
    this.collectionName = collectionName;
  }
}

export const notFoundHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    res.status(404);
    res.json({
      error: "NotFoundError",
      message: `${
        err.collectionName ? `${err.collectionName} ` : "Entity"
      } not found`,
    });
  } else {
    next(err);
  }
};
