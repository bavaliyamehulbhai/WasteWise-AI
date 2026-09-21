import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    platformName: { type: String, default: "WasteWise OS" },
    supportEmail: { type: String, default: "support@wastewise.ai" },
    darkMode: { type: Boolean, default: true },
    enableNotifications: { type: Boolean, default: true },
    require2FA: { type: Boolean, default: false },
    sessionTimeout: { type: String, default: "60" },
    aiModel: { type: String, default: "groq-llama-3" },
    confidenceThreshold: { type: String, default: "75" },
    gamificationEnabled: { type: Boolean, default: true },
    xpMultiplier: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);
export default SystemSettings;
