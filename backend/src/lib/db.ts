import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not defined within environment variables"
      );
    }
    const connect = await mongoose.connect(uri);
    console.log("MONGODB Connected Successfully: ", connect.connection.host);
  } catch (error) {
    console.log("Error occurred while connecting to MongoDB: ", error);
    process.exit(1);
  }
};
