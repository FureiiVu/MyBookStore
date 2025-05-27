import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to Mongo DB ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect Mongo DB: ${error}`);
    process.exit(1);
  }
};
