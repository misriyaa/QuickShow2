import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ Database Connected:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ DB ERROR:", error.message);
    process.exit(1);
  }
};

export default connectDB;