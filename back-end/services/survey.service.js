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
  if (!mongoose.isValidObjectId(surveyId)) {
    throw new Error("Ідентифікатор опитування недійсний");
  }
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
              boundaries: [16, 25, 35, 45, 55, 70, 85, 100],
              output: { count: { $sum: 1 } },
            },
          },
        ],
        questionStats: [
          { $unwind: "$answers" },
          {
            $addFields: {
              "answers.answer": {
                $cond: {
                  if: { $isArray: "$answers.answer" },
                  then: "$answers.answer",
                  else: {
                    $cond: {
                      if: { $eq: ["$answers.answer", null] },
                      then: [],
                      else: ["$answers.answer"],
                    },
                  },
                },
              },
            },
          },
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

  const finalAnalytics = analytics[0] || {};

  if (finalAnalytics.questionStats) {
    finalAnalytics.questionStats = finalAnalytics.questionStats.map((stat) => {
      const questionDoc = survey.questions.id(stat._id);

      return {
        ...stat,
        title: questionDoc ? questionDoc.title : "Назва відсутня",
      };
    });
  }

  if (finalAnalytics.ageStats) {
    finalAnalytics.ageStats = finalAnalytics.ageStats.map((bucket) => {
      let label;
      switch (bucket._id) {
        case 16:
          label = "16-24";
          break;
        case 25:
          label = "25-34";
          break;
        case 35:
          label = "35-44";
          break;
        case 45:
          label = "45-54";
          break;
        case 55:
          label = "55-69";
          break;
        case 70:
          label = "70-84";
          break;
        case 85:
          label = "85+";
          break;
      }
      return { ...bucket, label };
    });
  }

  if (finalAnalytics.genderStats) {
    finalAnalytics.genderStats = finalAnalytics.genderStats.map((bucket) => {
      let label;
      switch (bucket._id) {
        case "male":
          label = "Чоловік";
          break;
        case "female":
          label = "Жінка";
          break;
      }
      return { ...bucket, label };
    });
  }

  return { survey, analytics: analytics[0] || {} };
};
