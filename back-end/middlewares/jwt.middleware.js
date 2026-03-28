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

        if (accessResult.id) {
            req.user = { id: accessResult.id, role: accessResult.role };
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

            if (!refreshResult.id) {
                return res.status(403).json({
                    success: false,
                    message: "Потрібна авторизація",
                });
            }

            const newAccessToken = generateAccessToken(
                refreshResult.id,
                refreshResult.role
            );

            if (!newAccessToken) {
                console.error(refreshResult.id);
                return res.status(500).json({
                    success: false,
                    message: "Аутентифікація не вдалась",
                });
            }

            req.user = { id: refreshResult.id, role: refreshResult.role };
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
