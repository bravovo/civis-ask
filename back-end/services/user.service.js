import User from "../models/user.model.js";

export const updateUser = async (id, updateData) => {
  console.log("updateData:", updateData);
  if (
    !updateData.firstName &&
    !updateData.lastName &&
    !updateData.age &&
    !updateData.gender
  ) {
    throw new Error("Немає даних для оновлення");
  }

  if (updateData.password) {
    throw new Error("Неможливо оновити пароль з допомогою цього запиту");
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    context: "query",
  }).select("-password");

  return updatedUser;
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Користувача не знайдено");
  }

  const isMatch = await user.comparePasswords(currentPassword);

  if (!isMatch) {
    throw new Error("Невірний пароль");
  }

  user.password = newPassword;
  await user.save();
  return true;
};

//TODO add delete user data functionality (surveys, survey results?, etc.)
export const deleteUserData = async (id, password) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("Користувача не знайдено");
  }

  const isMatch = await user.comparePasswords(password);
  if (!isMatch) {
    throw new Error("Невірний пароль");
  }

  await User.findByIdAndDelete(id);
  return true;
};
