import { Router } from "express";

import { postSurvey } from "../controllers/surveys.controller.js";

const router = Router();

router.post("/survey", postSurvey);

export default router;
