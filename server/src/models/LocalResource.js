import mongoose from "mongoose";

const localResourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["e-waste", "recycling_center", "compost", "hazardous", "general"],
      required: true 
    },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    contactInfo: {
      phone: { type: String },
      website: { type: String }
    },
    operatingHours: { type: String },
    verified: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const LocalResource = mongoose.model("LocalResource", localResourceSchema);
export default LocalResource;
