import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cashMachineRoutes from "./routes/cashMachineRoutes";
import { config } from "./config";

const app = express();
app.use(
  cors({
    origin: [config.frontendUrl, "http://localhost:9000"],
  })
);
app.use(express.json());

// Use the defined routes
app.use("/api/user", userRoutes);
app.use("/api", cashMachineRoutes);

export default app;
