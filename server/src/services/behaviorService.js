import Scan from "../models/Scan.js";
import UserChallenge from "../models/UserChallenge.js";

/**
 * Get distribution of categories scanned by a user
 */
export const getUserCategoryDistribution = async (userId) => {
  const distribution = await Scan.aggregate([
    { $match: { userId } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return distribution;
};

/**
 * Get the trend of recent scans (last 30 days vs previous 30 days)
 */
export const getRecentScanTrend = async (userId) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const recentCount = await Scan.countDocuments({
    userId,
    createdAt: { $gte: thirtyDaysAgo },
  });

  const previousCount = await Scan.countDocuments({
    userId,
    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
  });

  let trend = "stable";
  if (recentCount > previousCount + 2) trend = "increasing";
  else if (recentCount < previousCount - 2) trend = "decreasing";

  return { trend, recentCount, previousCount };
};

/**
 * Analyze scanning behavior and determine learning needs
 */
export const getLearningNeeds = async (userId) => {
  const distribution = await getUserCategoryDistribution(userId);
  
  if (distribution.length === 0) {
    return ["general-recycling", "getting-started"];
  }

  const topCategory = (distribution[0] && distribution[0]._id) ? String(distribution[0]._id) : "General Waste";
  const needs = [topCategory.toLowerCase()];

  // If they scan a lot of plastic, they might need to learn about specific plastics
  if (topCategory === "Plastic" && distribution[0].count > 5) {
    needs.push("pet-plastic");
  }

  // Find categories they have NEVER scanned (could mean they don't know how)
  const allCategories = ["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste"];
  const scannedCategories = distribution.map(d => d._id);
  const missingCategories = allCategories.filter(c => !scannedCategories.includes(c));

  if (missingCategories.length > 0) {
    needs.push(missingCategories[0].toLowerCase());
  }

  return needs;
};

/**
 * Generate a complete behavioral profile
 */
export const generateBehaviorProfile = async (userId) => {
  const distribution = await getUserCategoryDistribution(userId);
  const topCategory = distribution.length > 0 ? distribution[0]._id : null;
  const secondCategory = distribution.length > 1 ? distribution[1]._id : null;
  const { trend } = await getRecentScanTrend(userId);
  const learningNeeds = await getLearningNeeds(userId);

  return {
    topCategory,
    secondCategory,
    scanFrequency: trend, // Simplified
    recentTrend: trend,
    learningAreas: learningNeeds,
  };
};
