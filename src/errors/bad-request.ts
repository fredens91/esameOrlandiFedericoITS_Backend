import { Request, Response, NextFunction } from "express";

export class BadRequestError extends Error {
  name: string = "BadRequestError";
  message: string = "";
  entity: any;
  constructor(message?: any) {
    super(message);
    this.message = message;
  }
}

export const badRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BadRequestError) {
    res.status(400);
    res.json({
      error: err.name,
      message: err.message,
      entity: err.entity,
    });
  } else {
    next(err);
  }
};
