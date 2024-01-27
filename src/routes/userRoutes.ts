import { Router } from "express";
import {
  checkIfUserExists,
  initializeUser,
  initializeUserWithReferrer,
} from "../controllers/userController";

const router = Router();

router.get("/:id", checkIfUserExists);
router.post("/initialize", initializeUser);
router.post("/initialize-with-ref", initializeUserWithReferrer);

export default router;
