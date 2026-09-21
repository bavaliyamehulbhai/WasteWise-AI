import LearningContent from "../models/LearningContent.js";
import LearningProgress from "../models/LearningProgress.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

// @desc    Get all learning modules with user progress
// @route   GET /api/learning
// @access  Private
export const getLearningModules = async (req, res, next) => {
  try {
    const modules = await LearningContent.find({ published: true }).select("-content").sort({ createdAt: -1 });
    
    // Get progress for the current user
    const progresses = await LearningProgress.find({ userId: req.user._id });
    
    const modulesWithProgress = modules.map(mod => {
      const prog = progresses.find(p => p.contentId.toString() === mod._id.toString());
      return {
        ...mod.toObject(),
        progress: prog ? (prog.completed ? 100 : 0) : 0, // Simplified: either 0 or 100 based on completion
        completed: prog?.completed || false,
      };
    });

    // Group by category for the UI
    const grouped = modulesWithProgress.reduce((acc, mod) => {
      if (!acc[mod.category]) acc[mod.category] = [];
      acc[mod.category].push(mod);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      modules: grouped,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific learning module and its quiz
// @route   GET /api/learning/:slug
// @access  Private
export const getLearningModuleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const module = await LearningContent.findOne({ slug, published: true });
    
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    const quiz = await Quiz.findOne({ contentId: module._id });
    const progress = await LearningProgress.findOne({ userId: req.user._id, contentId: module._id });

    // Strip answers from quiz
    let safeQuiz = null;
    if (quiz) {
      safeQuiz = {
        _id: quiz._id,
        xpReward: quiz.xpReward,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options
        }))
      };
    }

    res.status(200).json({
      success: true,
      module,
      quiz: safeQuiz,
      completed: progress?.completed || false,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz attempt and mark module as complete
// @route   POST /api/learning/:slug/quiz
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { answers } = req.body; // Array of selected indices

    const module = await LearningContent.findOne({ slug });
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    const quiz = await Quiz.findOne({ contentId: module._id });
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    // Grade the quiz
    let correctCount = 0;
    const results = quiz.questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q._id,
        isCorrect,
        correctAnswer: q.correctAnswerIndex,
        explanation: q.explanation
      };
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= 70; // 70% to pass

    // Record Attempt
    await QuizAttempt.create({
      userId: req.user._id,
      quizId: quiz._id,
      passed,
      score
    });

    let xpAwarded = 0;

    if (passed) {
      // Mark as complete in LearningProgress
      const progress = await LearningProgress.findOneAndUpdate(
        { userId: req.user._id, contentId: module._id },
        { completed: true, completedAt: new Date() },
        { upsert: true, new: false } // Check if it was already completed before
      );

      // Prevent duplicate XP if they already passed it previously
      if (!progress || !progress.completed) {
        xpAwarded = quiz.xpReward;
        const user = await User.findById(req.user._id);
        user.xp += xpAwarded;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      passed,
      score,
      xpAwarded,
      results
    });
  } catch (error) {
    next(error);
  }
};
