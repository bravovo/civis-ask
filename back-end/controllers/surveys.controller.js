import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";
import {
  getUserSurveys,
  getSurveysPassedByUser,
  patchEditSurvey,
} from "../services/survey.service.js";
import User from "../models/user.model.js";

export const postSurvey = async (req, res, next) => {
  try {
    const { title, description, questions, status } = req.body;
    console.log(status);

    const formattedQuestions = questions.map((q) => ({
      title: q.title,
      required: q.required,
      type: q.type,
      options: (q.options || []).map((opt) => ({
        value: opt.text,
      })),
    }));

    const survey = await Survey.create({
      title,
      description,
      status,
      author: req.user.id,
      questions: formattedQuestions,
    });

    if (!survey) {
      throw new Error("Помилка створення опитування");
    }

    return res.status(201).json({
      success: true,
      message: "Опитування успішно створено",
      survey,
    });
  } catch (error) {
    next(error);
  }
};

export const editSurvey = async (req, res, next) => {
  try {
    const { title, description, questions, status } = req.body;
    const { surveyId } = req.params;

    const { error, updatedSurvey } = await patchEditSurvey({
      title,
      description,
      questions,
      status,
      surveyId,
      userId: req.user.id,
    });

    if (error) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Опитування успішно відредаговано",
      updatedSurvey,
    });
  } catch (error) {
    next(error);
  }
};

export const getSurvey = async (req, res, next) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId).populate({
      path: "author",
      select: "firstName lastName",
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Опитування не знайдено",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Опитування знайдено",
      survey,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedSurveys = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ status: "published" }).populate(
      "author"
    );

    if (surveys.length === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
      success: true,
      message: `Знайдено опитувань: ${surveys.length}`,
      surveys,
    });
  } catch (error) {
    next(error);
  }
};

export const postSurveyPass = async (req, res, next) => {
  const user = req.user;
  const { surveyId } = req.params;
  const { answers } = req.body;

  try {
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Відповіді на опитування порожні",
      });
    }

    const userData = await User.findById(user.id).select("age gender").lean();

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "Демографічних даних користувача не знайдено",
      });
    }

    const surveyTake = await SurveyTake.create({
      survey: surveyId,
      user: user.id,
      demographics: {
        age: userData.age,
        gender: userData.gender,
      },
      answers,
    });

    if (!surveyTake) {
      throw new Error("Помилка проходження опитування");
    }

    return res.status(201).json({
      success: true,
      message: "Опитування пройдено успішно",
      surveyTake,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserSurveys = async (req, res, next) => {
  try {
    const user = req.user;

    const userSurveys = await getUserSurveys(user);

    return res.status(200).json({
      success: true,
      message: "Опитування користувача успішно знайдено",
      surveys: userSurveys,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserPassedSurveys = async (req, res, next) => {
  try {
    const user = req.user;

    const surveysPassedByUser = await getSurveysPassedByUser(user);

    return res.status(200).json({
      success: true,
      message: "Опитування, пройдені користувачем успішно знайдено",
      surveys: surveysPassedByUser,
    });
  } catch (error) {
    next(error);
  }
};
