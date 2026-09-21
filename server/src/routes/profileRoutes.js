import express from "express";
import { getSustainabilityProfile, updateSustainabilityProfile } from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getSustainabilityProfile)
  .put(updateSustainabilityProfile);

export default router;
