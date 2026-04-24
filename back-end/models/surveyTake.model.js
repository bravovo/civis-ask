import mongoose from "mongoose";

const surveyTake = mongoose.Schema(
  {
    survey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    demographics: {
      age: {
        type: Number,
        min: [16, "Вік має бути не менше 16 років"],
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
      },
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        answer: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  { timestamps: true }
);

const SurveyTake = mongoose.model("SurveyTake", surveyTake);

export default SurveyTake;
