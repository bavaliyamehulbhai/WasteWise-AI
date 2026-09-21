import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
  link = "",
  metadata = {},
}) => {
  const user = await User.findById(userId).select("notifications");

  if (!user) {
    return null;
  }

  // Respect user preference for notifications, but allow 'system' notifications to bypass (e.g. security critical)
  if (!user.notifications && type !== "system") {
    return null;
  }

  return Notification.create({
    userId,
    type,
    title,
    message,
    link,
    metadata,
  });
};
