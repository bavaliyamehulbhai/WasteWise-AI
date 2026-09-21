import mongoose from "mongoose";
import dotenv from "dotenv";
import Scan from "./models/Scan.js";

dotenv.config();

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("Connected to MongoDB for migration");

    const categoryMap = {
      "Plastic Waste": "Plastic",
      "Paper Waste": "Paper",
      "Glass Waste": "Glass",
      "Organic Waste": "Organic",
      "Metal Waste": "Metal",
      "Electronic Waste": "E-Waste",
      "General": "General Waste",
      "Unknown": "Other"
    };

    let totalUpdated = 0;

    for (const [oldCat, newCat] of Object.entries(categoryMap)) {
      const result = await Scan.updateMany(
        { category: oldCat },
        { $set: { category: newCat } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Migrated ${result.modifiedCount} scans from '${oldCat}' to '${newCat}'`);
        totalUpdated += result.modifiedCount;
      }
    }
    
    // Also, handle any other category that is not in the allowed list by assigning it to 'Other'
    const allowedCategories = [
      "Plastic",
      "Paper",
      "Glass",
      "Metal",
      "Organic",
      "E-Waste",
      "General Waste",
      "Other",
    ];

    const unmappedResult = await Scan.updateMany(
      { category: { $nin: allowedCategories } },
      { $set: { category: "Other" } }
    );

    if (unmappedResult.modifiedCount > 0) {
      console.log(`Migrated ${unmappedResult.modifiedCount} unmapped categories to 'Other'`);
      totalUpdated += unmappedResult.modifiedCount;
    }

    console.log(`Migration completed! Total documents updated: ${totalUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateCategories();
