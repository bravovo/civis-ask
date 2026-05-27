import mongoose from "mongoose";

import { MONGO_URI } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
  } catch (err) {
    throw err;
  }
};
