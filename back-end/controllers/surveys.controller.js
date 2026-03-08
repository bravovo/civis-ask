import Survey from "../models/survey.model.js";

export const postSurvey = async (req, res, next) => {
  try {
    const { title, description, questions } = req.body;

    const formattedQuestions = questions.map((q) => ({
      title: q.title,
      required: q.required,
      type: q.type,
      answerOptions: (q.options || []).map((opt) => opt.text),
    }));

    const survey = await Survey.create({
      title,
      description,
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
