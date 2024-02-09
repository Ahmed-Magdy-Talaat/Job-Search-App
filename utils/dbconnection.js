import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongodbUrl = process.env.MONGODB_URL;
    if (!mongodbUrl) {
      throw new Error(
        "MongoDB URL is not defined in the environment variables."
      );
    }
    await mongoose
      .connect(mongodbUrl)
      .then(() => console.log("DB is connected successfully"));
  } catch (err) {
    console.log(err.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
