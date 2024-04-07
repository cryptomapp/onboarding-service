import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { config } from "./config";
import {
  convertARStoUSDC,
  convertUSDCToARS,
} from "./utils/blueDollarConverter";

const app = express();
app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:9000"],
  })
);
app.use(express.json());

// Use the defined routes
app.use("/api/user", userRoutes);

// TODO: DELETE IT!
// POST endpoint for ARS to USDC conversion
app.post("/convert-ars-to-usdc", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).send({ error: "ARS amount is required" });
    }
    const usdcValue = await convertARStoUSDC(amount);
    return res.json({ arsValue: amount, usdcValue });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error converting currency" });
  }
});

// POST endpoint for USDC to ARS conversion
app.post("/convert-usdc-to-ars", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).send({ error: "USDC amount is required" });
    }
    const arsValue = await convertUSDCToARS(amount);
    return res.json({ usdcValue: amount, arsValue });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error converting currency" });
  }
});

export default app;
