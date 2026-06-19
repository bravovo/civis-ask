import Survey from "../models/survey.model.js";
import SurveyTake from "../models/surveyTake.model.js";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { AI_API_KEY } from "../config/env.js";

const genAI = new GoogleGenAI({ apiKey: AI_API_KEY });

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

  if (!Array.isArray(surveysPassedByUser)) {
    throw new Error("Помилка отримання пройдених користувачем опитувань");
  }

  const validTakes = surveysPassedByUser.filter((take) => take.survey !== null);

  const processedSurveys = validTakes.map((take) => {
    const survey = take.survey;

    const authorId = survey.author?._id
      ? survey.author._id.toString()
      : survey.author
        ? survey.author.toString()
        : "";

    const isAuthor = authorId === user.id.toString();

    return {
      ...take,
      survey: {
        ...survey,
        isAuthor: isAuthor,
      },
    };
  });

  return processedSurveys;
};

export const deleteSurveyById = async (surveyId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await SurveyTake.deleteMany({
      survey: new mongoose.Types.ObjectId(surveyId),
    }).session(session);

    await Survey.deleteOne({
      _id: new mongoose.Types.ObjectId(surveyId),
    }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const aiInstruction = `# ROLE & TASK
You are an expert survey methodology assistant. Analyze the provided survey question and its response options for validity, neutrality, completeness, and mutual exclusivity. You must output your analysis STRIClY in the specified JSON format.

# LANGUAGE & TONE
- Output all text inside the JSON string values in Ukrainian.
- Tone: Polite, direct, honest, and concise.
- DO NOT use any IT/technical jargon. Use plain, everyday language.
- CRITICAL: Never use the words "checkbox", "radio", "чекбокс", or "радіобаттон". Instead, use "Одинарний вибір" (for radio) and "Множинний вибір" (for checkbox).

# ANALYSIS RULES & CONSTRAINTS
1. Analyze if the structural type (radio/checkbox) fits the logic of the question.
2. Assess options for overlap (mutual exclusivity) and coverage (completeness), neutrality, validity and clarity.
3. DO NOT recommend adding "Other", "Write your own answer", or text inputs, as the system does not support free-form text.
4. Focus strictly on the question and its options. Ignore external context or the order of options.
5. Be consistent: if a recommendation is given, it must be definitive. Do not contradict yourself in subsequent evaluations of similar patterns.
6. Ignore the order of options and don't recommend to change it.

# OUTPUT FORMAT
Return ONLY a valid JSON object. Do not wrap it in markdown code blocks (\`\`\`json). The structure must strictly follow this shape:
{
  "score": number, // A rating from 1 (very poor) to 10 (excellent)
  "comment": "string", // Brief analysis of the question
  "recommendations": ["string"], // Array of actionable improvements. Empty array if score is 10.
  "suggestedOptions": ["string"] // Array of corrected or optimized answer choices.
}

# EVALUATION EXAMPLES (For scale and format consistency)
Example 1:
Input: Question: "Вам подобається наш сервіс?", Type: "radio", Options: "Так, Ні"
Output: {
  "score": 8,
  "comment": "Питання зрозуміле, але не зовсім нейтральне через обмежений вибір. 
    Варто розширити варіанти для тих, хто не визначився.",
  "recommendations": [
    "Додати варіант нейтральної відповіді для збалансованості."
  ],
  "suggestedOptions": [
    "Так",
    "Ні",
    "Важко відповісти"
  ]
}

Example 2:
Input: Question: "Скільки вам років?", Type: "radio", Options: "10-20, 20-30, 30-40"
Output: { "score": 4, "comment": "Варіанти відповіді перетинаються між собою. Незрозуміло, який варіант обирати людині, якій рівно 20 або 30 років.", "recommendations": ["Зробити вікові інтервали такими, що не перетинаються."], "suggestedOptions": ["10-19", "20-29", "30-39", "40+"] }

Example 3:
Input: Question: "Оцініть якість роботи", Type: "radio", Options: "Добре"
Output: { "score": 3, "comment": "Питання не має достатньої конкретики та містить лише один варіант відповіді, що унеможливлює вибір.", "recommendations": ["Додати повноцінну шкалу оцінювання."], "suggestedOptions": ["Погано", "Задовільно", "Добре", "Відмінно"] }`;

const surveyAnalysisSchema = {
  score: "number",
  comment: "string",
  recommendations: "string[]",
  suggestedOptions: "string[]",
};

export const getSurveyQuestionAnalysis = async (surveyData) => {
  const { title, type, options } = surveyData;

  if (title.trim().length === 0) {
    const error = new Error("Відсутня назва питання");
    error.status = 400;
    throw error;
  }

  if (type.trim().length === 0) {
    const error = new Error("Відсутній тип питання");
    error.status = 400;
    throw error;
  }

  if (!options || !Array.isArray(options) || options.length === 0) {
    const error = new Error("Відсутні варіанти відповіді для питання");
    error.status = 400;
    throw error;
  }

  const content = `Question: ${title}\nType: ${type}\nAnswer Options: ${options
    .map((opt) => opt.value)
    .join(", ")}
  `;

  const response = await genAI.models
    .generateContent({
      model: "gemini-3.1-flash-lite",
      contents: content,
      config: {
        systemInstruction: aiInstruction,
        responseMimeType: "application/json",
        responseJsonSchema: surveyAnalysisSchema,
        temperature: 0.1,
        maxOutputTokens: 800,
      },
    })
    .catch((err) => {
      const error = new Error(
        "Помилка при отриманні аналізу відповіді від штучного інтелекту"
      );
      error.status = 500;
      throw error;
    });

  if (!response?.text) {
    const error = new Error(
      "Отримано некоректну відповідь від штучного інтелекту"
    );
    error.status = 500;
    throw error;
  }

  try {
    const analysis = JSON.parse(response.text);
    return analysis;
  } catch (err) {
    const error = new Error("Помилка обробки відповіді від штучного інтелекту");
    error.status = 500;
    throw error;
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
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $match: {
              "answers.answer": { $nin: [null, "", undefined] },
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
