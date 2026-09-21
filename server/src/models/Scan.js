import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    imageId: {
      type: String,
      default: "",
    },

    wasteName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Plastic",
        "Paper",
        "Glass",
        "Metal",
        "Organic",
        "E-Waste",
        "General Waste",
        "Other",
      ],
      trim: true,
    },

    material: {
      type: String,
      default: "",
      trim: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    disposalStatus: {
      type: String,
      required: true,
      enum: [
        "recyclable",
        "general-waste",
        "compost",
        "special-disposal",
        "reuse",
        "unknown",
      ],
      default: "unknown",
    },

    disposalGuide: {
      type: String,
      default: "",
      trim: true,
    },

    classificationStatus: {
      type: String,
      enum: ["classified", "needs-review", "unable-to-classify"],
      default: "classified",
    },

    isWaste: {
      type: Boolean,
      default: true,
    },

    aiProvider: {
      type: String,
      default: "groq",
    },

    aiModel: {
      type: String,
      default: "unknown",
    },

    aiVersion: {
      type: String,
      default: "v1",
    },

    evidence: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast dashboard KPI aggregation and filtering
scanSchema.index({ userId: 1, createdAt: -1 });
scanSchema.index({ userId: 1, category: 1, createdAt: -1 });
scanSchema.index({ userId: 1, disposalStatus: 1, createdAt: -1 });

const Scan = mongoose.model("Scan", scanSchema);

export default Scan;
