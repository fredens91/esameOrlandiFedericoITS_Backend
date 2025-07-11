import { Router } from "express";
import { AddUserDTO, LoginDTO } from "./auth.dto";
import { add, login } from "./auth.controller";
import { list as userList } from "../user/user.controller";
import { validate } from "../../utils/validation-middleware";

const router = Router();
router.post("/login", validate(LoginDTO), login);
router.post("/register", validate(AddUserDTO, "body"), add);
router.get("/users", userList);

export default router;
