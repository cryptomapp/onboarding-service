import { Router } from "express";
import { checkIfUserExists } from "../controllers/userController";
// Import necessary functions from controllers or services

const router = Router();

router.get("/:id", checkIfUserExists);

router.post("/initialize", async (req, res) => {
  // Handle /initialize logic
  // Call functions from Solana service with req.body data
});

router.post("/initialize-with-ref", async (req, res) => {
  // Handle /initialize-with-ref logic
  // Call functions from Solana service with req.body data
});

export default router;
