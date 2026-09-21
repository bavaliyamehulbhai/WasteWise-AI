import mongoose from "mongoose";

const recommendationFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recommendationId: {
      type: String,
      required: true,
      index: true,
    },
    feedback: {
      type: String,
      enum: ["helpful", "not_helpful", "dismissed"],
      required: true,
    },
  },
  { timestamps: true }
);

const RecommendationFeedback = mongoose.model("RecommendationFeedback", recommendationFeedbackSchema);
export default RecommendationFeedback;
