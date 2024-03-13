import dotenv from "dotenv";
dotenv.config();

export const config = {
  irysUrl: "https://devnet.irys.xyz",

  solanaProviderUrl: "https://api.devnet.solana.com",
  solPrivateKey:
    process.env.SERVICE_WALLET ||
    "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",

  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/merchants",
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",

  // CryptoMapp scripts/initialize_state.js
  usdcMintAddress:
    process.env.CUSTOM_USDC_MINT ||
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet
  stateAddress:
    process.env.STATE_ADDRESS || "5HzkGM1XFoVrrPLjanQ7Le1Aa4iHPf3aivfKLUztmwFn",
};
