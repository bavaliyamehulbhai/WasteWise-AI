import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

import User from "../src/models/User.js";
import Scan from "../src/models/Scan.js";
import Notification from "../src/models/Notification.js";
import UserBadge from "../src/models/UserBadge.js";
import UserChallenge from "../src/models/UserChallenge.js";
import connectDB from "../src/config/db.js";

const runSeeder = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    console.log("Wiping old demo account...");
    const demoEmail = "demo@wastewise.app";
    const existingDemoUser = await User.findOne({ email: demoEmail });

    if (existingDemoUser) {
      await Scan.deleteMany({ userId: existingDemoUser._id });
      await Notification.deleteMany({ userId: existingDemoUser._id });
      await UserBadge.deleteMany({ userId: existingDemoUser._id });
      await UserChallenge.deleteMany({ userId: existingDemoUser._id });
      await User.deleteOne({ _id: existingDemoUser._id });
    }

    console.log("Creating Demo User...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    const demoUser = await User.create({
      name: "Demo Evaluator",
      email: demoEmail,
      password: hashedPassword,
    });

    console.log("Seeding Demo Scans...");
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();

    const scansToCreate = [
      {
        userId: demoUser._id,
        wasteName: "Coca Cola Can",
        category: "Metal",
        material: "Aluminum",
        confidence: 96,
        disposalStatus: "recyclable",
        disposalGuide: "Rinse and place in the metal recycling bin.",
        classificationStatus: "classified",
        isWaste: true,
        createdAt: new Date(today.getTime() - 1 * oneDay),
      },
      {
        userId: demoUser._id,
        wasteName: "Cardboard Box",
        category: "Paper",
        material: "Cardboard",
        confidence: 99,
        disposalStatus: "recyclable",
        disposalGuide: "Flatten before placing in the paper recycling bin.",
        classificationStatus: "classified",
        isWaste: true,
        createdAt: new Date(today.getTime() - 2 * oneDay),
      },
      {
        userId: demoUser._id,
        wasteName: "Plastic Water Bottle",
        category: "Plastic",
        material: "PET",
        confidence: 94,
        disposalStatus: "recyclable",
        disposalGuide: "Empty liquids and recycle.",
        classificationStatus: "classified",
        isWaste: true,
        createdAt: new Date(today.getTime() - 3 * oneDay),
      },
      {
        userId: demoUser._id,
        wasteName: "Apple Core",
        category: "Organic",
        material: "Food Waste",
        confidence: 98,
        disposalStatus: "compost",
        disposalGuide: "Place in compost bin.",
        classificationStatus: "classified",
        isWaste: true,
        createdAt: new Date(today.getTime() - 4 * oneDay),
      }
    ];

    await Scan.insertMany(scansToCreate);

    console.log("Seeding Demo Badges & XP...");
    await UserBadge.create({
      userId: demoUser._id,
      badgeKey: "first_scan",
      earnedAt: new Date(today.getTime() - 4 * oneDay),
    });

    await User.findByIdAndUpdate(demoUser._id, {
      $set: { xp: 200 }
    });

    console.log("✅ Demo account seeding completed!");
    console.log(`Email: ${demoEmail}`);
    console.log(`Password: demo123`);

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeeder();
