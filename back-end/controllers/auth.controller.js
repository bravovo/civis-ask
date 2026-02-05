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
