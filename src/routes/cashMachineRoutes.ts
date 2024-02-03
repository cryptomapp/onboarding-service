import { Router } from "express";
import {
  mintCustomUSDC,
  getMintInfo,
  getUSDCBalance,
} from "../controllers/cashMachineController";

const router = Router();

router.post("/mint-usdc", mintCustomUSDC);
router.get("/mint-info", getMintInfo);
router.get("/usdc-balance/:accountAddress", getUSDCBalance);

export default router;
