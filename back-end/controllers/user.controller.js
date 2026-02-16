import User from "../models/user.model.js";

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        const token = req.newToken;

        const user = await User.findById(id, "-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Користувача не знайдено",
            });
        }

        return res.status(200).json({
            success: true,
            token,
            user,
        });
    } catch (err) {
        next(err);
    }
};
