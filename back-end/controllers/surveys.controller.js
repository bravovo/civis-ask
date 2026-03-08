import Survey from "../models/survey.model.js";

export const postSurvey = async (req, res, next) => {
  try {
    const { title, description, questions, status } = req.body;
    console.log(status);

    const formattedQuestions = questions.map((q) => ({
      title: q.title,
      required: q.required,
      type: q.type,
      answerOptions: (q.options || []).map((opt) => opt.text),
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
      "author",
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
