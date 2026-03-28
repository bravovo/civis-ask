import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";

export const getUserSurveys = async (user) => {
  if (!user || !user.id) {
    throw new Error("Користувача не знайдено");
  }

  const userSurveys = await Survey.find({ author: user.id }).populate({
    path: "author",
    select: "firstName lastName",
  });

  if (Array.isArray(userSurveys)) {
    return userSurveys;
  } else {
    throw new Error("Помилка отримання опитувань користувача");
  }
};

export const getSurveysPassedByUser = async (user) => {
  if (!user || !user.id) {
    throw new Error("Користувача не знайдено");
  }

  const surveysPassedByUser = await SurveyTake.find({ user: user.id })
    .populate({
      path: "survey",
      populate: { path: "author", select: "firstName lastName" },
    })
    .lean();

  console.log("SURVEYS", surveysPassedByUser[0].survey);

  if (Array.isArray(surveysPassedByUser)) {
    return surveysPassedByUser.filter((take) => take.survey !== null);
  } else {
    throw new Error("Помилка отримання пройдених користувачем опитувань");
  }
};
