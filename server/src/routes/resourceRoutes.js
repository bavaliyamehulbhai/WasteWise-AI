import express from "express";
import { getResources, getResourceById } from "../controllers/resourceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getResources);
router.route("/:id").get(getResourceById);

export default router;
