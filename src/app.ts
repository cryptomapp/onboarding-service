import express from "express";
import userRoutes from "./routes/userRoutes";
import cashMachineRoutes from "./routes/cashMachineRoutes";

const app = express();
app.use(express.json());

// Use the defined routes
app.use("/api/user", userRoutes);
app.use("/api", cashMachineRoutes);

export default app;
