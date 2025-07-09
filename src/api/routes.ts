import { Router } from "express";
import userRouter from "./user/user.router";
import baseItemRouter from "./base-item/base.item.router";
import linkedItemRouter from './linked-item/linked.item.router';
import authRouter from "./auth/auth.router";

const router = Router();

router.use("/user", userRouter);
router.use("/base-item", baseItemRouter);
router.use("/incontri", linkedItemRouter);

router.use(authRouter);

export default router;
