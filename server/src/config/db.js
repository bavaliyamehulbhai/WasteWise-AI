import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not defined in .env. Skipping database connection for now.");
    return;
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
