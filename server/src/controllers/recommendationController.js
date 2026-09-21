import { generateRecommendations } from "../services/recommendationService.js";
import RecommendationFeedback from "../models/RecommendationFeedback.js";

// @desc    Get user recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await generateRecommendations(req.user._id);

    res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback for a recommendation
// @route   POST /api/recommendations/:id/feedback
// @access  Private
export const submitFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body; // 'helpful', 'not_helpful', 'dismissed'

    if (!["helpful", "not_helpful", "dismissed"].includes(feedback)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback type",
      });
    }

    const recFeedback = await RecommendationFeedback.create({
      userId: req.user._id,
      recommendationId: id,
      feedback,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: recFeedback,
    });
  } catch (error) {
    next(error);
  }
};
