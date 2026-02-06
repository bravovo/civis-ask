import User from "../models/user.model.js";

export const getUser = async (req, res, next) => {
    try {
        const email = req.user;

        const user = await User.findOne({ email }, "-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "Користувача не знайдено",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        next(err);
    }
};
