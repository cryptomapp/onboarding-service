import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { SolanaCashMachineService } from "../services/solanaCashMachineService";

const cashMachineService = SolanaCashMachineService.getInstance();

export const mintCustomUSDC = async (req: Request, res: Response) => {
  try {
    const { toAddress, amount } = req.body;
    if (!toAddress || amount <= 0) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }
    const toPublicKey = new PublicKey(toAddress);
    const signature = await cashMachineService.mintCustomUSDC(
      toPublicKey,
      amount
    );
    res.status(200).json({ message: "USDC minted successfully", signature });
  } catch (error) {
    console.error("Error minting custom USDC:", error);
    res.status(500).json({ error: "Error minting custom USDC" });
  }
};

export const getUSDCBalance = async (req: Request, res: Response) => {
  try {
    const accountAddress = new PublicKey(req.params.accountAddress);
    console.log("accountAddress:", accountAddress);
    const balance = await cashMachineService.getUSDCBalance(accountAddress);
    res.status(200).json({ balance });
  } catch (error) {
    console.error("Error in getTokenBalance:", error);
    res.status(500).json({ error: "Error getting custom USDC balance" });
  }
};

export const getMintInfo = async (req: Request, res: Response) => {
  try {
    const mintAddress = cashMachineService.getMintAddress();
    if (!mintAddress) {
      return res.status(404).json({ error: "Mint address not found" });
    }
    res.status(200).json({ mintAddress });
  } catch (error) {
    console.error("Error fetching mint info:", error);
    res.status(500).json({ error: "Error fetching mint info" });
  }
};
