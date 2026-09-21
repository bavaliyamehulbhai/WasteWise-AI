import mongoose from "mongoose";

const disposalRuleSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
    },
    material: {
      type: String,
      default: "",
      index: true,
    },
    region: {
      country: { type: String, default: "", index: true },
      state: { type: String, default: "", index: true },
      city: { type: String, default: "", index: true },
    },
    accepted: {
      type: Boolean,
      default: true,
    },
    preparation: {
      type: [String],
      default: [],
    },
    disposalMethod: {
      type: String,
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KnowledgeSource",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "review", "verified", "expired"],
      default: "draft",
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for fast regional lookups
disposalRuleSchema.index({
  category: 1,
  material: 1,
  "region.country": 1,
  "region.state": 1,
  "region.city": 1,
});

const DisposalRule = mongoose.model("DisposalRule", disposalRuleSchema);

export default DisposalRule;
