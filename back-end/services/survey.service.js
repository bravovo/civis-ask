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

  if (!survey) {
    const error = new Error("Опитування не знайдено");
    error.status = 404;
    throw error;
  }

  if (!survey.author.equals(userId)) {
    const error = new Error("Заборонено редагувати чужі опитування");
    error.status = 403;
    throw error;
  }

  if (survey.status === "published") {
    const error = new Error("Не можна редагувати опубліковані опитування");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    const error = new Error("Питання опитування не заповнені");
    error.status = 400;
    throw error;
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
    throw new Error("Помилка редагування опитування");
  }

  return updatedSurvey;
};

export const getUserSurveys = async (user) => {
  if (!user || !user.id) {
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
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
    const error = new Error("Користувача не знайдено");
    error.status = 404;
    throw error;
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
    const error = new Error("Ідентифікатор опитування недійсний");
    error.status = 400;
    throw error;
  }
  const id = new mongoose.Types.ObjectId(surveyId);

  const survey = await Survey.findById(id);
  if (!survey) {
    const error = new Error("Опитування не знайдено");
    error.status = 404;
    throw error;
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
                gender: "$demographics.gender",
                age: "$demographics.age",
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: {
                questionId: "$_id.questionId",
                option: "$_id.option",
              },
              count: { $sum: "$count" },
              genders: {
                $push: { gender: "$_id.gender", count: "$count" },
              },
              ages: {
                $push: { age: "$_id.age", count: "$count" },
              },
            },
          },
          {
            $group: {
              _id: "$_id.questionId",
              results: {
                $push: {
                  option: "$_id.option",
                  count: "$count",
                  genders: "$genders",
                  ages: "$ages",
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

  const getAgeLabel = (age) => {
    if (!age) return "Не вказано";
    if (age >= 85) return "85+";
    if (age >= 70) return "70-84";
    if (age >= 55) return "55-69";
    if (age >= 45) return "45-54";
    if (age >= 35) return "35-44";
    if (age >= 25) return "25-34";
    if (age >= 16) return "16-24";
  };

  if (finalAnalytics.questionStats) {
    console.log(finalAnalytics.questionStats);

    finalAnalytics.questionStats = finalAnalytics.questionStats.map((stat) => {
      const questionDoc = survey.questions.id(stat._id);

      const processedResults = stat.results.map((res) => {
        const genders = res.genders.reduce((acc, curr) => {
          const label = curr.gender === "male" ? "Чоловік" : "Жінка";
          acc[label] = (acc[label] || 0) + curr.count;
          return acc;
        }, {});

        const ages = res.ages.reduce((acc, curr) => {
          const label = getAgeLabel(curr.age);
          acc[label] = (acc[label] || 0) + curr.count;
          return acc;
        }, {});

        return {
          option: res.option,
          count: res.count,
          genderBreakdown: Object.entries(genders).map(([label, count]) => ({
            label,
            count,
          })),
          ageBreakdown: Object.entries(ages).map(([label, count]) => ({
            label,
            count,
          })),
        };
      });

      return {
        ...stat,
        title: questionDoc ? questionDoc.title : "Назва відсутня",
        results: processedResults,
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

  return { survey, analytics: finalAnalytics || {} };
};
