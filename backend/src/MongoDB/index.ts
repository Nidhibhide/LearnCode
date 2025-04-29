// src/MongoDB/index.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default DBConnect;
