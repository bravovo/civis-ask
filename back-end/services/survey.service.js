import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";
import mongoose from "mongoose";

export const patchEditSurvey = async ({
  surveyId,
  userId,
  title,
  description,
  questions,
  status,
}) => {
  const survey = await Survey.findById(surveyId);
  let error;

  if (!survey) {
    error = {
      status: 404,
      message: "Опитування не знайдено",
    };
    return { error, updatedSurvey: null };
  }

  if (!survey.author.equals(userId)) {
    error = {
      status: 403,
      message: "Заборонено редагувати чужі опитування",
    };
    return { error, updatedSurvey: null };
  }

  if (survey.status === "published") {
    error = {
      status: 400,
      message: "Не можна редагувати опубліковані опитування",
    };
    return { error, updatedSurvey: null };
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    error = {
      status: 400,
      message: "Питання опитування не заповнені",
    };
    return { error, updatedSurvey: null };
  }

  const formattedQuestions = questions.map((q) => ({
    title: q.title,
    required: q.required,
    type: q.type,
    options: (q.options || []).map((opt) => ({
      value: opt.value || opt.text,
    })),
  }));

  const updatedSurvey = await Survey.findByIdAndUpdate(
    surveyId,
    {
      title,
      description,
      status,
      questions: formattedQuestions,
    },
    { new: true, runValidators: true }
  );

  if (!updatedSurvey) {
    error = {
      status: 500,
      message: "Помилка редагування опитування",
    };
    return { error, updatedSurvey: null };
  }

  return { error: null, updatedSurvey };
};

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

  if (Array.isArray(surveysPassedByUser)) {
    return surveysPassedByUser.filter((take) => take.survey !== null);
  } else {
    throw new Error("Помилка отримання пройдених користувачем опитувань");
  }
};

export const getAnalyticsForSurvey = async (surveyId) => {
  const id = new mongoose.Types.ObjectId(surveyId);

  const survey = await Survey.findById(id);
  if (!survey) {
    throw new Error("Опитування не знайдено");
  }

  const analytics = await SurveyTake.aggregate([
    { $match: { survey: id } },
    {
      $facet: {
        totalParticipants: [{ $count: "count" }],
        genderStats: [
          {
            $group: {
              _id: "$demographics.gender",
              count: { $sum: 1 },
            },
          },
        ],
        ageStats: [
          {
            $bucket: {
              groupBy: "$demographics.age",
              boundaries: [0, 18, 25, 35, 50, 100],
              default: "Other",
              output: { count: { $sum: 1 } },
            },
          },
        ],
        questionStats: [
          { $unwind: "$answers" },
          {
            $unwind: {
              path: "$answers.answer",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: {
                questionId: "$answers.questionId",
                option: "$answers.answer",
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: "$_id.questionId",
              results: {
                $push: {
                  option: "$_id.option",
                  count: "$count",
                },
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalParticipants: {
          $arrayElemAt: ["$totalParticipants.count", 0],
        },
        genderStats: "$genderStats",
        ageStats: "$ageStats",
        questionStats: "$questionStats",
      },
    },
  ]);

  return { survey, analytics: analytics[0] || {} };
};
