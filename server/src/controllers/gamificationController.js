import User from "../models/User.js";
import UserBadge from "../models/UserBadge.js";
import { getLevelProgress } from "../utils/levelUtils.js";

export const getGamification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("xp level");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const levelData = getLevelProgress(user.xp);

    const badges = await UserBadge.find({
      userId: req.user._id,
    })
      .sort({ earnedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      gamification: {
        xp: user.xp,
        level: levelData.level,
        currentXP: levelData.currentXP,
        xpForNextLevel: levelData.xpForNextLevel,
        progress: levelData.progress,
        badges,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to load rewards",
    });
  }
};
