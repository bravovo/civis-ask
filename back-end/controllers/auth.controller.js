import { NODE_ENV } from "../config/env.js";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Усі дані для реєстрації необхідні",
            });
        }

        if (password.length < 8 || password.length > 64) {
            return res.status(400).json({
                success: false,
                message: "Довжина паролю має складати від 8 до 64 символів",
            });
        }

        const sameUser = await User.findOne({ email });

        if (sameUser) {
            return res.status(409).json({
                success: false,
                message: "Користувач із такою електронною поштою вже існує",
            });
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
        });

        await user.save();

        if (!user) {
            throw new Error("Невдалось створити акаунт користувача");
        }

        return res.status(201).json({
            success: true,
            message: "Акаунт користувача успішно створено",
        });
    } catch (err) {
        return next(err);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Даних для авторизації не надано",
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Невірні дані авторизації",
        });
    }

    const isMatch = await user.comparePasswords(password);

    if (!isMatch) {
        console.log("NO MATCH", isMatch);
        return res.status(400).json({
            success: false,
            message: "Невірні дані авторизації",
        });
    }

    const refreshToken = generateRefreshToken(user.id, user.role);
    const accessToken = generateAccessToken(user.id, user.role);

    if (!accessToken || !refreshToken) {
        throw new Error("Генерація токенів доступу не вдалась");
    }

    res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 7 * 1000,
        secure: NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.status(200).json({
        success: true,
        accessToken,
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        message: "Авторизація успішна",
    });
};
