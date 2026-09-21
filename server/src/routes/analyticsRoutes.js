import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getAnalyticsData } from "../controllers/analyticsController.js";

const router = express.Router();

router.use(protect);

router.get("/", getAnalyticsData);

export default router;
