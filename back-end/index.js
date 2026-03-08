import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/database.js";

import { PORT, CLIENT_ORIGIN, NODE_ENV } from "./config/env.js";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import uploadsRoute from "./routes/uploads.route.js";
import surveysRoute from "./routes/surveys.route.js";

import { checkUserAccess } from "./middlewares/jwt.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser());

connectDB();

app.get("/", (req, res, next) => {
  res.send("API is okay");
});

app.use("/api/auth", authRoute);

app.use(checkUserAccess);

app.use("/api/user", userRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/surveys", surveysRoute);

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const errMsg = err.message.split(":")[2];
    return res.status(400).json({ message: errMsg });
  }

  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(NODE_ENV, "ENV");
  console.log("LISTENING ON PORT", PORT);
});
