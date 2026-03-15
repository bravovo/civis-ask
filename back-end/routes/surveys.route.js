import { Router } from "express";

import {
  getPublishedSurveys,
  getSurvey,
  postSurvey,
  postSurveyPass,
} from "../controllers/surveys.controller.js";

const router = Router();

router.post("/survey", postSurvey);

router.get("/", getPublishedSurveys);

router.get("/survey/:surveyId", getSurvey);

router.post("/survey/:surveyId/pass", postSurveyPass);

export default router;
