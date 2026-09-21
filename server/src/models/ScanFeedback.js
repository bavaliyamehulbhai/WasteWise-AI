import mongoose from "mongoose";

const scanFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true,
    },

    correct: {
      type: Boolean,
      required: true,
    },

    correctedCategory: {
      type: String,
      default: "",
    },

    correctedMaterial: {
      type: String,
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    reviewStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

scanFeedbackSchema.index({ scanId: 1, createdAt: -1 });

const ScanFeedback = mongoose.model("ScanFeedback", scanFeedbackSchema);

export default ScanFeedback;
