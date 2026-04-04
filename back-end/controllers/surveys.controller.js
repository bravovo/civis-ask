import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";
import {
    getUserSurveys,
    getSurveysPassedByUser,
} from "../services/survey.service.js";

export const postSurvey = async (req, res, next) => {
    try {
        const { title, description, questions, status } = req.body;
        console.log(status);

        const formattedQuestions = questions.map((q) => ({
            title: q.title,
            required: q.required,
            type: q.type,
            answerOptions: (q.options || []).map((opt) => ({
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

export const getSurvey = async (req, res, next) => {
    try {
        const { surveyId } = req.params;

        const survey = await Survey.findById(surveyId).populate("author");

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
            return res.status(204);
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
        if (answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Відповіді на опитування порожні",
            });
        }

        const surveyTake = await SurveyTake.create({
            survey: surveyId,
            user: user.id,
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
