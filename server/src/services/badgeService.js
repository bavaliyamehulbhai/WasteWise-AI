import Scan from "../models/Scan.js";
import UserBadge from "../models/UserBadge.js";

export const BADGE_RULES = {
  first_scan: {
    name: "First Scan",
    description: "Completed your first waste scan",
    requiredScans: 1,
  },
  scan_starter: {
    name: "Scan Starter",
    description: "Completed 10 waste scans",
    requiredScans: 10,
  },
  waste_explorer: {
    name: "Waste Explorer",
    description: "Completed 25 waste scans",
    requiredScans: 25,
  },
  waste_warrior: {
    name: "Waste Warrior",
    description: "Completed 50 waste scans",
    requiredScans: 50,
  },
};

export const checkScanBadges = async (userId) => {
  const scanCount = await Scan.countDocuments({ userId });

  const earnedBadges = [];

  for (const [badgeKey, rule] of Object.entries(BADGE_RULES)) {
    if (scanCount >= rule.requiredScans) {
      const existingBadge = await UserBadge.findOne({ userId, badgeKey });

      if (!existingBadge) {
        const badge = await UserBadge.create({ userId, badgeKey });
        earnedBadges.push(badge);

        // Send notification for new badge
        import("../services/notificationService.js").then(({ createNotification }) => {
          createNotification({
            userId,
            type: "badge_unlocked",
            title: "Badge unlocked",
            message: `You earned the ${rule.name} badge.`,
            link: "/rewards",
            metadata: {
              badgeKey,
            },
          }).catch(err => console.error("Failed to create badge notification:", err));
        });
      }
    }
  }

  return earnedBadges;
};
