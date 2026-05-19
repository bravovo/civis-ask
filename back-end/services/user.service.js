import User from "../models/user.model.js";
import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";
import mongoose from "mongoose";

export const updateUser = async (id, updateData) => {
  console.log("updateData:", updateData);

  const allowedUpdateFields = ["firstName", "lastName", "age", "gender"];
  const hasUpdateData = allowedUpdateFields.some(
    (field) => updateData[field] !== undefined
  );

  if (!hasUpdateData) {
    const error = new Error("Немає даних для оновлення");
    error.status = 400;
    throw error;
  }

  if (updateData.password || updateData.role) {
    const error = new Error(
      "Неможливо оновити пароль або роль з допомогою цього запиту"
    );
    error.status = 400;
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    context: "query",
  }).select("-password");

  return updatedUser;
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
    const error = new Error(
      "Поточний та новий паролі обов'язкові для оновлення"
    );
    error.status = 400;
    throw error;
  }

  const user = await User.findById(id);

  if (!user) {
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
  }

  const isMatch = await user.comparePasswords(currentPassword);

  if (!isMatch) {
    const error = new Error("Невірний поточний пароль");
    error.status = 400;
    throw error;
  }

  if (newPassword.length < 8 || newPassword.length > 64) {
    const error = new Error(
      "Новий пароль повинен містити не менше 8 та не більше 64 символів"
    );
    error.status = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();
  return true;
};

export const deleteUserData = async (id, password) => {
  if (!password) {
    const error = new Error("Пароль обов'язковий для видалення акаунта");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(id);

  if (!user) {
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
  }

  const isMatch = await user.comparePasswords(password);
  if (!isMatch) {
    const error = new Error("Невірний пароль");
    error.status = 400;
    throw error;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const authoredSurveys = await Survey.find({ author: id }, "_id").session(
      session
    );
    const authoredSurveyIds = authoredSurveys.map((s) => s._id);

    await SurveyTake.deleteMany({
      $or: [{ survey: { $in: authoredSurveyIds } }, { user: id }],
    }).session(session);

    await Survey.deleteMany({ author: id }).session(session);
    await User.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
