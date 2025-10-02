import WorkerService from "../services/worker.js";

export const createWorker = async (req, res) => {
  try {
    const worker = await WorkerService.create(req.body);
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await WorkerService.findAll();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const worker = await WorkerService.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};