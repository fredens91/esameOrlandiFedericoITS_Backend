import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { UserModel } from "../../../api/user/user.model";
import { HydratedDocument } from "mongoose";
import { User } from "../../../api/user/user.entity";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    async (username, password, done) => {
      try {
        const userDoc = await UserModel.findOne({ username });

        if (!userDoc) {
          return done(null, false, {
            message: `username ${username} not found`,
          });
        }

        const match = await bcrypt.compare(password, userDoc.password);

        if (!match) {
          return done(null, false, { message: "invalid password" });
        }

        const user = (userDoc as HydratedDocument<User>).toObject();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
