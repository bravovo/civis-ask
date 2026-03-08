import mongoose from "mongoose";

import { MONGO_URI } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      family: 4,
    });
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error(err);
  }
};
