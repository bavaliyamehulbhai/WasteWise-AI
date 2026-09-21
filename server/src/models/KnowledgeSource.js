import mongoose from "mongoose";

const knowledgeSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    region: {
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["draft", "review", "verified", "expired"],
      default: "draft",
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const KnowledgeSource = mongoose.model("KnowledgeSource", knowledgeSourceSchema);

export default KnowledgeSource;
