import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js";

export function generateRefreshToken(id, role) {
    try {
        return jwt.sign({ id, role }, REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    } catch (error) {
        return null;
    }
}

export function generateAccessToken(id, role) {
    try {
        return jwt.sign({ id, role }, ACCESS_TOKEN_SECRET, {
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

        if (decoded && decoded.id) {
            return { id: decoded.id, role: decoded.role, error: null };
        }
        return { id: null, role: null, error: "Невірне наповнення токена" };
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { id: null, role: null, error: "expired" };
        }
        return { id: null, role: null, error: error.message };
    }
};
