import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    passed: { type: Boolean, required: true },
    score: { type: Number, required: true }, // percentage 0-100
  },
  { timestamps: true }
);

// Allow multiple attempts, but we'll only reward XP once.

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
