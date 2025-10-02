import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import workerRoutes from "./routes/worker.js";
import { startSimulation } from "./simulations/worker.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/workers", workerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSimulation(); // inicia a simulação dos dados
});