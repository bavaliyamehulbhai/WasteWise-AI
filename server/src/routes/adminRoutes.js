import express from "express";
import { 
  getUsers, 
  updateUser, 
  getFeedbackQueue,
  getDashboardMetrics,
  reviewFeedback,
  getSettings,
  updateSettings,
  getAuditLogs
} from "../controllers/adminController.js";
import {
  getSources,
  createSource,
  updateSourceStatus,
  getRules,
  createRule,
  updateRuleStatus
} from "../controllers/knowledgeController.js";
import { getSystemHealth } from "../controllers/systemController.js";
import protect from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply auth and admin check to all routes
router.use(protect);

router.get("/metrics", authorize("admin"), getDashboardMetrics);
router.get("/system/health", authorize("admin"), getSystemHealth);
router.get("/users", authorize("admin"), getUsers);
router.put("/users/:id", authorize("admin"), updateUser);

// Reviewers and Admins can access feedback
router.get("/feedback", authorize("admin", "reviewer"), getFeedbackQueue);
router.put("/feedback/:id/review", authorize("admin", "reviewer"), reviewFeedback);

// Knowledge Sources
router.get("/knowledge/sources", authorize("admin", "reviewer"), getSources);
router.post("/knowledge/sources", authorize("admin", "reviewer"), createSource);
router.put("/knowledge/sources/:id/status", authorize("admin", "reviewer"), updateSourceStatus);

// Disposal Rules
router.get("/knowledge/rules", authorize("admin", "reviewer"), getRules);
router.post("/knowledge/rules", authorize("admin", "reviewer"), createRule);
router.put("/knowledge/rules/:id/status", authorize("admin", "reviewer"), updateRuleStatus);

// Settings
router.get("/settings", authorize("admin"), getSettings);
router.put("/settings", authorize("admin"), updateSettings);

// Audit Logs
router.get("/logs", authorize("admin"), getAuditLogs);

export default router;
