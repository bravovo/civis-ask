import {
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
  patchSurveyVerificationService,
  deleteSurveyService,
} from "../services/admin.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService(req.user.role);

    if (!Array.isArray(users)) {
      throw new Error("Помилка отримання користувачів");
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const patchUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    await updateUserRoleService(userId, newRole, req.user.role);

    return res.status(200).json({
      success: true,
      message: "Роль користувача успішно оновлено",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await deleteUserService(userId, req.user.role);
  } catch (err) {
    next(err);
  }
};

export const patchSurveyVerification = async (req, res, next) => {
  try {
    const { surveyId } = req.params;
    const { isVerified } = req.body;

    await patchSurveyVerificationService(surveyId, isVerified, req.user.role);

    return res.status(200).json({
      success: true,
      message: "Статус верифікації опитування успішно оновлено",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;

    await deleteSurveyService(surveyId, req.user.role);
  } catch (err) {
    next(err);
  }
};
