import { Router } from "express";

import {
  getPublishedSurveys,
  getSurvey,
  postSurvey,
  postSurveyPass,
  getCurrentUserSurveys,
  getCurrentUserPassedSurveys,
  editSurvey,
  getSurveyAnalytics,
  deleteSurvey,
  getSurveyAnalysis,
} from "../controllers/surveys.controller.js";

const router = Router();

router.post("/survey", postSurvey);

router.get("/", getPublishedSurveys);

router.post("/survey/analysis", getSurveyAnalysis);

router.get("/survey/:surveyId", getSurvey);

router.patch("/survey/:surveyId/edit", editSurvey);

router.post("/survey/:surveyId/pass", postSurveyPass);

router.get("/user-surveys", getCurrentUserSurveys);

router.get("/user-passed-surveys", getCurrentUserPassedSurveys);

router.delete("/survey/:surveyId", deleteSurvey);

router.get("/survey/:surveyId/analytics", getSurveyAnalytics);

export default router;
