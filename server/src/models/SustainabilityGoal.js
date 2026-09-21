import mongoose from "mongoose";

const sustainabilityGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    goalType: { 
      type: String, 
      enum: ["scan_count", "learn_categories", "streak"],
      required: true 
    },
    target: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    completedAt: { type: Date },
    xpReward: { type: Number, default: 50 },
  },
  { timestamps: true }
);

const SustainabilityGoal = mongoose.model("SustainabilityGoal", sustainabilityGoalSchema);
export default SustainabilityGoal;
