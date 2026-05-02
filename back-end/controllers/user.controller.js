import { NODE_ENV } from "../config/env.js";
import User from "../models/user.model.js";
import {
  updatePassword,
  updateUser,
  deleteUserData,
} from "../services/user.service.js";

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

export const patchUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { firstName, lastName, age, gender } = req.body ?? {};

    const updatedUser = await updateUser(id, {
      firstName,
      lastName,
      age,
      gender,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Користувача для оновлення не знайдено",
      });
    }

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const putPassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    await updatePassword(id, currentPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: "Пароль успішно оновлено",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Пароль обов'язковий для підтвердження видалення",
      });
    }

    const result = await deleteUserData(id, password);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Не вдалося видалити користувача",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "None" : "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Користувача успішно видалено",
    });
  } catch (err) {
    next(err);
  }
};
