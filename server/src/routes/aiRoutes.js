import express from "express";
import { createScan } from "../controllers/scanController.js";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/classify", protect, upload.single("image"), createScan);

export default router;
