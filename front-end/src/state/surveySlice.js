import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../api/api";

const initialState = {
  status: "draft",
  title: "",
  description: "",
  questions: [],
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setSurvey: (_state, action) => {
      return { ...action.payload };
    },
    changeTitle: (state, action) => {
      state.title = action.payload;
    },
    changeDescription: (state, action) => {
      state.description = action.payload;
    },
    addQuestion: {
      reducer: (state, action) => {
        state.questions.push(action.payload);
      },
      prepare: () => ({
        payload: {
          _id: nanoid(),
          title: "",
          type: "radio",
          required: false,
          options: [],
        },
      }),
    },
    addOption: {
      reducer: (state, action) => {
        const question = state.questions.find(
          (q) => q._id === action.payload.questionId
        );

        question.options.push(action.payload.option);
      },
      prepare: (questionId) => ({
        payload: {
          questionId,
          option: {
            _id: nanoid(),
            value: "",
          },
        },
      }),
    },
    editOption: (state, action) => {
      const question = state.questions.find(
        (q) => q._id === action.payload.questionId
      );

      const option = question.options.find(
        (opt) => opt._id === action.payload.optionId
      );

      option.value = action.payload.value;
    },
    removeOption: (state, action) => {
      const question = state.questions.find(
        (q) => q._id === action.payload.questionId
      );

      question.options = question.options.filter(
        (o) => o._id !== action.payload.optionId
      );
    },
    editQuestion: (state, action) => {
      const question = state.questions.find((q) => q._id === action.payload.id);

      Object.assign(question, action.payload.changes);
    },
    removeQuestion: (state, action) => {
      const filtered = state.questions.filter(
        (q) => q._id !== action.payload.id
      );

      return { ...state, questions: filtered };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveSurvey.fulfilled, (_state, action) => {
      if (action.payload.status !== "draft") {
        return initialState;
      }
    });
    builder.addCase(editSurvey.fulfilled, (_state, action) => {
      if (action.payload.status !== "draft") {
        return initialState;
      }
    });
  },
});

export const saveSurvey = createAsyncThunk(
  "survey/saveSurvey",
  async (action, { getState }) => {
    const survey = getState().survey;
    const author = getState().profile;

    try {
      const response = await api.post(`/surveys/survey`, {
        ...survey,
        status: action.status === "publish" ? "published" : "draft",
      });

      response.data.survey.author = {
        _id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
      };

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Помилка збереження опитування"
        );
      } else {
        throw new Error("Помилка збереження опитування");
      }
    }
  }
);

export const editSurvey = createAsyncThunk(
  "survey/editSurvey",
  async (action, { getState }) => {
    const survey = getState().survey;

    try {
      const response = await api.patch(`/surveys/survey/${survey._id}/edit`, {
        ...survey,
        status: action.status === "publish" ? "published" : "draft",
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Помилка збереження опитування"
        );
      } else {
        throw new Error("Помилка збереження опитування");
      }
    }
  }
);

export const {
  resetState,
  setSurvey,
  changeTitle,
  changeDescription,
  addQuestion,
  addOption,
  editOption,
  removeOption,
  editQuestion,
  removeQuestion,
} = surveySlice.actions;

export default surveySlice.reducer;
