import mongoose from "mongoose";

const sustainabilityProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "gu"],
      default: "en",
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    goals: [
      {
        type: String,
      },
    ],
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SustainabilityProfile = mongoose.model("SustainabilityProfile", sustainabilityProfileSchema);
export default SustainabilityProfile;
