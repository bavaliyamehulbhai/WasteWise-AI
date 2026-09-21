import express from "express";
import { getMonthlyReport } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/monthly").get(getMonthlyReport);

export default router;
