import {
  getAllUsersService,
  updateUserRoleService,
  deleteUserService,
  patchSurveyVerificationService,
  deleteSurveyService,
  getUserService,
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

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserService(id, req.user.role);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const patchUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    await updateUserRoleService(id, newRole, req.user.role);

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
    const { id } = req.params;

    await deleteUserService(id, req.user.role);

    return res.sendStatus(204);
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
