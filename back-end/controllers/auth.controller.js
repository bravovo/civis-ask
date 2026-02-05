import User from "../models/user.model.js";

export const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Усі дані для реєстрації необхідні",
            });
        }

        const sameUser = await User.findOne({ email });

        if (sameUser) {
            return res.status(400).json({
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

export const login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Даних для авторизації не надано",
        });
    }

    console.log("LOGGED IN");

    return res.status(200).json({
        success: true,
        message: "Авторизація успішна",
    });
};
