import express from "express";
import { getRecommendations, submitFeedback } from "../controllers/recommendationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getRecommendations);
router.route("/:id/feedback").post(submitFeedback);

export default router;
