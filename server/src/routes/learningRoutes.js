import express from "express";
import { getLearningModules, getLearningModuleBySlug, submitQuiz } from "../controllers/learningController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getLearningModules);
router.route("/:slug").get(getLearningModuleBySlug);
router.route("/:slug/quiz").post(submitQuiz);

export default router;
