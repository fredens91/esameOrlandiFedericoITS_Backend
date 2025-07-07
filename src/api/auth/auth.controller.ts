import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import { AddUserDTO } from "./auth.dto";
import { pick } from "lodash";
import userService from "../user/user.service";
import { UserExistsError } from "../../errors/user-exist";
import passport from "passport";
import * as jwt from "jsonwebtoken";
import { requireEnvVars } from "../../utils/dotenv";

const [JWT_SECRET, EXPIRED_IN_JWT] = requireEnvVars([
  "JWT_SECRET",
  "EXPIRED_IN_JWT",
]);

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      username: req.body.username,
      password: req.body.password,
    };

    const credentials = pick(req.body, "username", "password");

    const newUser = await userService.add(userData, credentials);

    res.send(newUser);
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400).send(err.message);
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authMiddleware = passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          error: "LoginError",
          message: info.message,
        });
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: EXPIRED_IN_JWT,
      });

      res.status(200).json({
        user: payload,
        token,
      });
    });

    authMiddleware(req, res, next);
  } catch (e) {
    next(e);
  }
};
