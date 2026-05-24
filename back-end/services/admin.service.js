import User from "../models/user.model.js";
import Survey from "../models/survey.model.js";
import { isValidRole, isAdmin } from "../utils/utils.js";
import mongoose from "mongoose";

export const getAllUsersService = async (role) => {
  if (!isAdmin(role)) {
    const error = new Error("Доступ адміністратора заборонено");
    error.status = 403;
    throw error;
  }
  return await User.find({}, "-password");
};

export const getUserService = async (userId, role) => {
  if (!isAdmin(role)) {
    const error = new Error("Доступ адміністратора заборонено");
    error.status = 403;
    throw error;
  }

  const user = await User.findById(userId, "-password");

  if (!user) {
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
  }

  return user;
};

export const updateUserRoleService = async (userId, newRole, requesterRole) => {
  if (!isValidRole(newRole) || !isValidRole(requesterRole)) {
    const error = new Error("Недійсна роль користувача");
    error.status = 400;
    throw error;
  }

  if (!isAdmin(requesterRole)) {
    const error = new Error("Доступ адміністратора заборонено");
    error.status = 403;
    throw error;
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
  }

  user.role = newRole;
  await user.save();
};

export const deleteUserService = async (userId, requesterRole) => {
  if (!isAdmin(requesterRole)) {
    const error = new Error("Доступ адміністратора заборонено");
    error.status = 403;
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
    const deletedUser = await User.findByIdAndDelete(id).session(session);

    if (!deletedUser) {
      const error = new Error("Користувача не знайдено");
      error.status = 404;
      throw error;
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const patchSurveyVerificationService = async (
  surveyId,
  isVerified,
  requesterRole
) => {
  if (!isAdmin(requesterRole)) {
    const error = new Error("Доступ адміністратора заборонено");
    error.status = 403;
    throw error;
  }

  const survey = await Survey.findById(surveyId);

  if (!survey) {
    const error = new Error("Опитування не знайдено");
    error.status = 404;
    throw error;
  }

  survey.verified = isVerified;
  await survey.save();
};
