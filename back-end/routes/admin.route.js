import { Router } from "express";

import {
  getAllUsers,
  patchUserRole,
  deleteUser,
  patchSurveyVerification,
  deleteSurvey,
  getUser,
} from "../controllers/admin.controller.js";
import { getPublishedSurveys } from "../controllers/surveys.controller.js";

const router = Router();

router.get("/users", getAllUsers);

router.get("/user/:id", getUser);

router.patch("/user/:id/role", patchUserRole);

router.delete("/user/:id", deleteUser);

router.get("/surveys", getPublishedSurveys);

router.patch("/survey/:surveyId/verification", patchSurveyVerification);

router.delete("/survey/:surveyId", deleteSurvey);

export default router;
