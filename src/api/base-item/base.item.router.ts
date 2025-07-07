import { Router } from "express";
import {
  list,
  findOne,
  create,
  update,
  remove,
} from "../base-item/base.item.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/", list);
router.get("/:id", findOne);


router.post("/", isAuthenticated, create);
router.put("/:id", isAuthenticated, update);
router.delete("/:id", isAuthenticated, remove);

export default router;
