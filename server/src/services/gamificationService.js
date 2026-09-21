import User from "../models/User.js";
import { getLevelProgress } from "../utils/levelUtils.js";
import { checkScanBadges } from "./badgeService.js";
import { updateChallengesAfterScan } from "./challengeService.js";

export const awardScanXP = async (userId, scan, isFirstScanToday) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  let earnedXP = 10;

  if (isFirstScanToday) {
    earnedXP += 5;
  }

  const challengeXP = await updateChallengesAfterScan(userId, scan);
  earnedXP += challengeXP;

  user.xp += earnedXP;

  const levelData = getLevelProgress(user.xp);

  user.level = levelData.level;

  await user.save();

  const badges = await checkScanBadges(userId);

  return {
    earnedXP,
    totalXP: user.xp,
    level: user.level,
    levelData,
    badges,
  };
};
