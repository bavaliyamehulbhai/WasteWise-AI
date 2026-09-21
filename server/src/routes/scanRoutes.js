import express from "express";
import {
  createScan,
  getScans,
  getScanById,
  deleteScan,
} from "../controllers/scanController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect ALL scan routes
router.use(protect);

router.post("/", createScan);
router.get("/", getScans);
router.get("/:id", getScanById);
router.delete("/:id", deleteScan);

export default router;
