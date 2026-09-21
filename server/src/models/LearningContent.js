import mongoose from "mongoose";

const learningContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // e.g. "plastic", "e-waste", "general-recycling"
    language: { type: String, default: "en" },
    content: { type: String, required: true }, // markdown content
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    estimatedTime: { type: Number, required: true }, // in minutes
    published: { type: Boolean, default: true },
    source: { type: String }, // optional attribution
  },
  { timestamps: true }
);

const LearningContent = mongoose.model("LearningContent", learningContentSchema);
export default LearningContent;
