import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cashMachineRoutes from "./routes/cashMachineRoutes";

const app = express();
app.use(
  cors({
    origin: "https://www.cryptomapp.vercel.app",
  })
);
app.use(express.json());

// Use the defined routes
app.use("/api/user", userRoutes);
app.use("/api", cashMachineRoutes);

export default app;
