import dotenv from "dotenv";
dotenv.config();

export const config = {
  irysUrl: "https://devnet.irys.xyz",
  solanaProviderUrl: "https://api.devnet.solana.com",
  solPrivateKey:
    process.env.SERVICE_WALLET ||
    "4GVrk3J7GB8a29RqqBG6x9WZieDufp3ngPc6zcRH3JzfQN3WxLjMbgf98feTWdivSoXxM5EqpQQtzZzrAG6qJDMs",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/merchants",
  port: process.env.PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL || "https://cryptomapp.vercel.app",
  usdcMintAddress: process.env.CUSTOM_USDC_MINT,
};
