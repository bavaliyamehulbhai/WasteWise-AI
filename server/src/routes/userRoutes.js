import express from "express";

import {
  getProfile,
  updateProfile,
  updateSettings,
  updatePassword,
  deleteAccount,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);

router.put("/profile", upload.single("avatar"), updateProfile);

router.put("/settings", updateSettings);

router.put("/password", updatePassword);

router.delete("/account", deleteAccount);

export default router;
