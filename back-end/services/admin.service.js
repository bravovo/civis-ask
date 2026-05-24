import User from "../models/user.model.js";
import Survey from "../models/survey.model.js";
import { isValidRole, isAdmin } from "../utils/utils.js";

export const getAllUsersService = async (role) => {
  if (!isAdmin(role)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }
  return await User.find({}, "-password");
};

export const getUserService = async (userId, role) => {
  if (!isAdmin(role)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }

  const user = await User.findById(userId, "-password");

  if (!user) {
    throw new Error("Користувача не знайдено", { status: 404 });
  }

  return user;
};

export const updateUserRoleService = async (userId, newRole, requesterRole) => {
  if (!isValidRole(newRole) || !isValidRole(requesterRole)) {
    throw new Error("Недійсна роль користувача", { status: 400 });
  }

  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Користувача не знайдено", { status: 404 });
  }

  user.role = newRole;
  await user.save();
};

export const deleteUserService = async (userId, requesterRole) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error("Користувача не знайдено", { status: 404 });
  }
};

export const patchSurveyVerificationService = async (
  surveyId,
  isVerified,
  requesterRole
) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }

  const survey = await Survey.findById(surveyId);

  if (!survey) {
    throw new Error("Опитування не знайдено", { status: 404 });
  }

  survey.verified = isVerified;
  await survey.save();
};

export const deleteSurveyService = async (surveyId, requesterRole) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено", { status: 403 });
  }

  const deletedSurvey = await Survey.findByIdAndDelete(surveyId);
  if (!deletedSurvey) {
    throw new Error("Опитування не знайдено", { status: 404 });
  }
};
