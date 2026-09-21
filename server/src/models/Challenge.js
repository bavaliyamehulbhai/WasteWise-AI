import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["scan_count", "category_scan", "daily_scan", "learning", "quiz", "review"],
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
