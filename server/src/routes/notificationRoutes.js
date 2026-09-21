import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/read-all", markAllNotificationsRead);

router.patch("/:id/read", markNotificationRead);

router.delete("/:id", deleteNotification);

export default router;
