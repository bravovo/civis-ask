import User from "../models/user.model.js";
import { isAdmin } from "../utils/utils.js";

export const checkAdminAccess = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Користувача не знайдено",
    });
  }

  if (!isAdmin(user.role)) {
    return res.status(403).json({
      success: false,
      message: "Доступ адміністратора заборонено",
    });
  }

  req.user.role = user.role;

  next();
};
