import express from "express";
import cors from "cors";

import { PORT, CLIENT_ORIGIN, NODE_ENV } from "./config/env.js";

import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: CLIENT_ORIGIN,
        credentials: true,
    })
);

app.get("/", (req, res, next) => {
    res.send("API is okay");
});

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
    console.log(NODE_ENV, "ENV");
    console.log("LISTENING ON PORT", PORT);
});
