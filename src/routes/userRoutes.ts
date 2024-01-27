import { Router } from "express";
import {
  checkIfUserExists,
  initializeUser,
} from "../controllers/userController";
// Import necessary functions from controllers or services

const router = Router();

// Route for checking if a user exists by public key
router.get("/:id", checkIfUserExists);

// Route for initializing a user
router.post("/initialize", initializeUser);

router.post("/initialize-with-ref", async (req, res) => {
  // Handle /initialize-with-ref logic
  // Call functions from Solana service with req.body data
});

export default router;
