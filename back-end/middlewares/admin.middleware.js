import User from "../models/User.model.js";
import { isAdmin } from "../utils/utils.js";

export const checkAdminAccess = async (req, res, next) => {
  const { role, id } = req.user;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Користувача не знайдено",
    });
  }

  if (!isAdmin(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Доступ адміністратора заборонено",
    });
  }

  next();
};
