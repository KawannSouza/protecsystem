import express from "express";
import {
  createWorker,
  getWorkers,
  getWorkerById,
} from "../controllers/worker.js";

const router = express.Router();

router.post("/", createWorker);
router.get("/", getWorkers);
router.get("/:id", getWorkerById);

export default router;