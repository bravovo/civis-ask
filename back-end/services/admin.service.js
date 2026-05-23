import User from "../models/User.model.js";
import Survey from "../models/Survey.model.js";
import { isValidRole, isAdmin } from "../utils/utils.js";

export const getAllUsersService = async (role) => {
  if (!isAdmin(role)) {
    throw new Error("Доступ адміністратора заборонено");
  }
  return await User.find({}, "-password");
};

export const updateUserRoleService = async (userId, newRole, requesterRole) => {
  if (!isValidRole(newRole) || !isValidRole(requesterRole)) {
    throw new Error("Недійсна роль користувача");
  }

  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Користувача не знайдено");
  }

  user.role = newRole;
  await user.save();
};

export const deleteUserService = async (userId, requesterRole) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено");
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error("Користувача не знайдено");
  }
};

export const patchSurveyVerificationService = async (
  surveyId,
  isVerified,
  requesterRole
) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено");
  }

  const survey = await Survey.findById(surveyId);

  if (!survey) {
    throw new Error("Опитування не знайдено");
  }

  survey.isVerified = isVerified;
  await survey.save();
};

export const deleteSurveyService = async (surveyId, requesterRole) => {
  if (!isAdmin(requesterRole)) {
    throw new Error("Доступ адміністратора заборонено");
  }

  const deletedSurvey = await Survey.findByIdAndDelete(surveyId);
  if (!deletedSurvey) {
    throw new Error("Опитування не знайдено");
  }
};
