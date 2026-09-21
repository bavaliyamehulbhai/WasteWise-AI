import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import KnowledgeSource from "../src/models/KnowledgeSource.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const seedSources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const sources = [
      {
        name: "San Francisco Recology Guide",
        organization: "Recology SF",
        url: "https://www.recology.com/recology-san-francisco/what-goes-where/",
        status: "verified"
      },
      {
        name: "EPA E-Waste Guidelines",
        organization: "U.S. Environmental Protection Agency",
        url: "https://www.epa.gov/recycle/electronics-donation-and-recycling",
        status: "verified"
      },
      {
        name: "Global Composting Standards",
        organization: "World Wildlife Fund",
        url: "https://www.worldwildlife.org/initiatives/food-waste",
        status: "draft"
      }
    ];

    // Clear existing
    await KnowledgeSource.deleteMany({});
    
    // Insert new
    await KnowledgeSource.insertMany(sources);
    
    console.log("Successfully seeded 3 demo Knowledge Sources!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding sources:", error);
    process.exit(1);
  }
};

seedSources();
