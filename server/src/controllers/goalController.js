import SustainabilityGoal from "../models/SustainabilityGoal.js";
import User from "../models/User.js";

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
export const getGoals = async (req, res, next) => {
  try {
    let goals = await SustainabilityGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Auto-seed demo goals for portfolio presentation if none exist
    if (goals.length === 0) {
      const demoGoals = [
        {
          userId: req.user._id,
          title: "Scan 10 Items",
          goalType: "scan_count",
          target: 10,
          progress: 4,
          xpReward: 100,
          status: "active"
        },
        {
          userId: req.user._id,
          title: "Learn 5 Categories",
          goalType: "learn_categories",
          target: 5,
          progress: 5,
          xpReward: 150,
          status: "completed",
          completedAt: new Date(Date.now() - 86400000) // 1 day ago
        },
        {
          userId: req.user._id,
          title: "Maintain 3 Day Streak",
          goalType: "streak",
          target: 3,
          progress: 0,
          xpReward: 300,
          status: "active"
        }
      ];
      await SustainabilityGoal.insertMany(demoGoals);
      goals = await SustainabilityGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (req, res, next) => {
  try {
    const { title, goalType, target, xpReward } = req.body;

    const goal = await SustainabilityGoal.create({
      userId: req.user._id,
      title,
      goalType,
      target,
      xpReward: xpReward || 50
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:id/progress
// @access  Private
export const updateGoalProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const goal = await SustainabilityGoal.findOne({ _id: req.params.id, userId: req.user._id });

    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
    if (goal.status === "completed") return res.status(400).json({ success: false, message: "Goal already completed" });

    goal.progress = progress;

    let xpAwarded = 0;
    if (goal.progress >= goal.target) {
      goal.progress = goal.target;
      goal.status = "completed";
      goal.completedAt = new Date();

      // Award XP
      const user = await User.findById(req.user._id);
      user.xp += goal.xpReward;
      await user.save();
      xpAwarded = goal.xpReward;
    }

    await goal.save();

    res.status(200).json({ success: true, data: goal, xpAwarded });
  } catch (error) {
    next(error);
  }
};
