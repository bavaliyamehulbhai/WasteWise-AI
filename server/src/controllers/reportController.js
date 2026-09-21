import Scan from "../models/Scan.js";
import LearningProgress from "../models/LearningProgress.js";
import SustainabilityGoal from "../models/SustainabilityGoal.js";
import User from "../models/User.js";
import { generateBehaviorProfile } from "../services/behaviorService.js";

// @desc    Get monthly sustainability report
// @route   GET /api/reports/monthly
// @access  Private
export const getMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query; // optional params

    const date = new Date();
    const targetMonth = month ? parseInt(month) : date.getMonth();
    const targetYear = year ? parseInt(year) : date.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // 1. Get Scans for the month
    const scans = await Scan.find({
      userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const totalScans = scans.length;
    let recyclableCount = 0;
    const categoryCounts = {};

    scans.forEach(scan => {
      if (scan.disposalStatus === "recyclable") recyclableCount++;
      const cat = scan.category || "Unknown";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // 2. Get completed goals this month
    const completedGoals = await SustainabilityGoal.find({
      userId,
      status: "completed",
      completedAt: { $gte: startDate, $lte: endDate }
    });

    // 3. Get completed learning modules this month
    const completedLearning = await LearningProgress.find({
      userId,
      completed: true,
      completedAt: { $gte: startDate, $lte: endDate }
    }).populate("contentId", "title category xpReward");

    // 4. Get overall user behavior profile for insights
    const profile = await generateBehaviorProfile(userId);

    // Prepare report object
    const report = {
      period: {
        month: targetMonth,
        year: targetYear,
        startDate,
        endDate
      },
      scanning: {
        total: totalScans,
        recyclable: recyclableCount,
        accuracy: totalScans > 0 ? (recyclableCount / totalScans) * 100 : 0,
        topCategories: Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([category, count]) => ({ category, count }))
      },
      learning: {
        modulesCompleted: completedLearning.length,
        details: completedLearning.map(l => l.contentId?.title).filter(Boolean)
      },
      goals: {
        completed: completedGoals.length,
        details: completedGoals.map(g => g.title)
      },
      insights: {
        trend: profile.recentTrend,
        focusAreas: profile.learningAreas
      }
    };

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    import("fs").then(fs => {
      fs.writeFileSync("debug_error.txt", error.stack);
    });
    next(error);
  }
};
