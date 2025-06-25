import mongoose from "mongoose";

export const ConnectionDB = async () => {
  try {
    // Get MongoDB URL from environment variables
    const Mongobd_Url = process.env.DB_URL;

    if (!Mongobd_Url) {
      throw new Error("MongoDB connection string is missing in environment variables");
    }

    // Connect to MongoDB
    await mongoose.connect(Mongobd_Url, {
      dbName: "Tasks",
    });

    console.log("================================================");
    console.log("✅ Database connected successfully");
    console.log("================================================");

    return true; // Return connection status
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    throw error; // Re-throw to handle in calling function
  }
};