import { Router } from "express";

import {
  getPublishedSurveys,
  getSurvey,
  postSurvey,
} from "../controllers/surveys.controller.js";

const router = Router();

router.post("/survey", postSurvey);

router.get("/", getPublishedSurveys);

router.get("/survey/:surveyId", getSurvey);

export default router;
