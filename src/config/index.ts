import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

function createBase58Keypair(
  secretArrayStr: string | undefined
): string | undefined {
  if (!secretArrayStr) return undefined;
  const secretArray = JSON.parse(secretArrayStr);
  const secretUint8Array = Uint8Array.from(secretArray);
  const keypair = Keypair.fromSecretKey(secretUint8Array);
  return bs58.encode(keypair.secretKey);
}

export const config = {
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/merchants",

  solanaProviderUrl: process.env.SOLANA_RPC || "https://api.devnet.solana.com",
  solPrivateKey: createBase58Keypair(process.env.SERVICE_WALLET),
  stateAddress:
    process.env.STATE_ADDRESS || "DaeZ1fXW21NSfw2dRdySMRD1CCbnR3G5RLwpbod4vz2v",
  usdcMintAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
};
