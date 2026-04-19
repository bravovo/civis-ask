import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../api/api";

const localSurvey = localStorage.getItem("survey");
const getInitialState = () => {
  try {
    if (localSurvey && localSurvey !== "undefined") {
      return JSON.parse(localSurvey);
    }
  } catch (error) {
    console.error(error);
  }
  return {
    status: "draft",
    title: "",
    description: "",
    questions: [],
  };
};

const initialState = getInitialState();

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
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
          options: [
            {
              _id: nanoid(),
              text: "Варіант відповіді 1",
            },
          ],
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
            text: "",
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

      option.text = action.payload.text;
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
    builder.addCase(saveSurvey.fulfilled, () => {
      return getInitialState();
    });
    builder.addCase(editSurvey.fulfilled, () => {
      return getInitialState();
    });
  },
});

export const saveSurvey = createAsyncThunk(
  "survey/saveSurvey",
  async (action, { getState }) => {
    const survey = getState().survey;

    console.log(action);

    const response = await api.post(`/surveys/survey`, {
      ...survey,
      status: action.status === "publish" ? "published" : "draft",
    });

    localStorage.removeItem("survey");
    return response.data;
  }
);

export const editSurvey = createAsyncThunk(
  "survey/editSurvey",
  async (action, { getState }) => {
    const survey = getState().survey;

    const response = await api.patch(`/surveys/survey/${survey._id}/edit`, {
      ...survey,
      status: action.status === "publish" ? "published" : "draft",
    });

    localStorage.removeItem("survey");
    return response.data;
  }
);

export const {
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
