import { Router } from "express";
import { list, remove, me } from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/", isAuthenticated, list);

router.delete("/:id", isAuthenticated, remove);

router.get("/me", isAuthenticated, me);

export default router;
