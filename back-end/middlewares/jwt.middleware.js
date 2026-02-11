import { verifyToken, generateAccessToken } from "../utils/jwt.js";

export const checkUserAccess = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader && authHeader.split(" ")[1];

        if (!accessToken) {
            return res
                .status(401)
                .json({ success: false, message: "Токена доступу не надано" });
        }

        const accessResult = verifyToken(accessToken, true);

        if (accessResult.email) {
            req.user = { email: accessResult.email, role: accessResult.role };
            return next();
        }
        if (accessResult.error === "expired") {
            const refreshToken = req.cookies.token;

            if (!refreshToken) {
                console.log("No refresh");
                return res.status(401).json({
                    success: false,
                    message: "Потрібна авторизація",
                });
            }
            const refreshResult = verifyToken(refreshToken, false);

            if (!refreshResult.email) {
                return res.status(403).json({
                    success: false,
                    message: "Потрібна авторизація",
                });
            }

            const newAccessToken = generateAccessToken(
                refreshResult.email,
                refreshResult.role
            );

            if (!newAccessToken) {
                console.error(refreshResult.email);
                return res.status(500).json({
                    success: false,
                    message: "Аутентифікація не вдалась",
                });
            }

            req.user = { email: refreshResult.email, role: refreshResult.role };
            req.newToken = newAccessToken;
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Невірний access токен",
        });
    } catch (error) {
        next(error);
    }
};
