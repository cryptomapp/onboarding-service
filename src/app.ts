import express from "express";
import userRoutes from "./routes/userRoutes";
import cashMachineRoutes from "./routes/cashMachineRoutes";

console.log("from app.ts...");
const app = express();
app.use(express.json());

console.log("from app.ts 2...");

// Use the defined routes
app.use("/api/user", userRoutes);

console.log("from app.ts 3...");
app.use("/api", cashMachineRoutes);

console.log("from app.ts 4...");

export default app;
