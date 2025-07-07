import { Request, Response, NextFunction } from "express";

export class Passwrentalror extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Passwrentalror";
  }
}

export class SamePasswrentalror extends Passwrentalror {
  constructor() {
    super("The new password must be different from the current one.");
  }
}

export class PasswordMismatchError extends Passwrentalror {
  constructor() {
    super("The confirmation password does not match.");
  }
}

export const passwordHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Passwrentalror) {
    res.status(400); // Bad request for password-related errors
    res.json({
      error: err.name,
      message: err.message,
    });
  } else {
    next(err); // Pass to the default error handler for other types of errors
  }
};
