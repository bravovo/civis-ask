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

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const isMatch = origin === CLIENT_ORIGIN;
        const isVercelPreview =
            /^https:\/\/civis-ask(-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

        if (isMatch || isVercelPreview) {
            callback(null, true);
        } else {
            console.log(origin);
            callback(new Error("Заблоковано CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["x-new-access-token"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Помилка підключення до бази даних" });
    }
});

app.get("/", (req, res, next) => {
    res.send("API is okay");
});

app.use("/api/auth", authRoute);

app.use(checkUserAccess);

app.use("/api/user", userRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/surveys", surveysRoute);

app.use((err, req, res, next) => {
    console.log(err);
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

export default app;
