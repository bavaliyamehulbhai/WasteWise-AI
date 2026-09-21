import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getGamification } from "../controllers/gamificationController.js";

const router = express.Router();

router.use(protect);

router.get("/", getGamification);

export default router;
