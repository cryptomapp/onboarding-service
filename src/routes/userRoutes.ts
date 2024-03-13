import { Router } from "express";
import {
  checkIfUserExists,
  getUsdcAccountInfo,
  getUser,
  initializeUser,
  initializeUserWithReferrer,
} from "../controllers/userController";

const router = Router();

router.get("/:id", checkIfUserExists);
router.get("/get/:id", getUser);
router.get("/usdc/:id", getUsdcAccountInfo);
router.post("/initialize", initializeUser);
router.post("/initialize-with-ref", initializeUserWithReferrer);

export default router;
