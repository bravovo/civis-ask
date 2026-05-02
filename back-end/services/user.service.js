import User from "../models/user.model.js";
import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";

export const updateUser = async (id, updateData) => {
  console.log("updateData:", updateData);

  const allowedUpdateFields = ["firstName", "lastName", "age", "gender"];
  const hasUpdateData = allowedUpdateFields.some(
    (field) => updateData[field] !== undefined
  );

  if (!hasUpdateData) {
    throw new Error("Немає даних для оновлення");
  }

  if (updateData.password || updateData.role) {
    throw new Error(
      "Неможливо оновити пароль або роль з допомогою цього запиту"
    );
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
    throw new Error("Поточний та новий паролі обов'язкові для оновлення");
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error("Користувача не знайдено");
  }

  const isMatch = await user.comparePasswords(currentPassword);

  if (!isMatch) {
    throw new Error("Невірний пароль");
  }

  if (newPassword.length < 8) {
    throw new Error("Новий пароль повинен містити не менше 8 символів");
  }

  user.password = newPassword;
  await user.save();
  return true;
};

export const deleteUserData = async (id, password) => {
  try {
    if (!password) {
      throw new Error("Пароль обов'язковий для видалення акаунта");
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error("Користувача не знайдено");
    }

    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      throw new Error("Невірний пароль");
    }

    await Survey.deleteMany({ author: id });

    await SurveyTake.deleteMany({ user: id });

    await User.findByIdAndDelete(id);
  } catch (error) {
    console.log(error.message);
    return false;
  }
  return true;
};
