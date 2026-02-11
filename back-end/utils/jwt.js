import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js";

export function generateRefreshToken(email, role) {
    try {
        return jwt.sign({ email, role }, REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    } catch (error) {
        return null;
    }
}

export function generateAccessToken(email, role) {
    try {
        return jwt.sign({ email, role }, ACCESS_TOKEN_SECRET, {
            expiresIn: "10m",
        });
    } catch (error) {
        return null;
    }
}

export const verifyToken = (token, isAccess = false) => {
    try {
        const decoded = jwt.verify(
            token,
            isAccess ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET
        );

        if (decoded && decoded.email) {
            return { email: decoded.email, role: decoded.role, error: null };
        }
        return { email: null, role: null, error: "Невірне наповнення токена" };
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { email: null, role: null, error: "expired" };
        }
        return { email: null, role: null, error: error.message };
    }
};
