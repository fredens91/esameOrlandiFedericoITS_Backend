import { Router } from "express";
import { list, remove, me, listSubscribed, subscribeToTournament, changeRoleToAdmin } from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/", isAuthenticated, list);
router.get("/partecipanti", isAuthenticated, listSubscribed);

router.post("/torneo/iscriviti", isAuthenticated, subscribeToTournament);
router.post("/torneo/sono-un-organizzatore", isAuthenticated, changeRoleToAdmin);

router.delete("/:id", isAuthenticated, remove);

router.get("/me", isAuthenticated, me);

export default router;
