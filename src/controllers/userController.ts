import { Request, Response } from "express";
import { SolanaService } from "../services/solanaService";
import { PublicKey } from "@solana/web3.js";

const solanaService = SolanaService.getInstance();

export const initializeUser = async (req: Request, res: Response) => {
  console.log("initializeUser req.body", req.body);
  try {
    const userPublicKey = new PublicKey(req.body.userPublicKey);
    await solanaService.initializeUser(userPublicKey);
    res.status(200).json({ message: "User initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error initializing user" });
  }
};

// export const initializeUserWithReferrer = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const userPublicKey = new PublicKey(req.body.userPublicKey);
//     const referrerPublicKey = new PublicKey(req.body.referrerPublicKey);
//     await solanaService.initializeUserWithReferrer(
//       userPublicKey,
//       referrerPublicKey
//     );
//     res
//       .status(200)
//       .json({ message: "User with referrer initialized successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error initializing user with referrer" });
//   }
// };

export const checkIfUserExists = async (req: Request, res: Response) => {
  try {
    const userPublicKey = new PublicKey(req.params.id);
    const userExists = await solanaService.checkIfUserExists(userPublicKey);
    res.status(200).json({ userExists });
  } catch (error) {
    res.status(500).json({ error: "Error checking if user exists" });
  }
};
