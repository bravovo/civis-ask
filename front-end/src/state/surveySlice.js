import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../config/env";

const localSurvey = localStorage.getItem("survey");
const initialState = localSurvey
  ? JSON.parse(localSurvey)
  : {
      status: "draft",
      title: "",
      description: "",
      questions: [],
    };

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
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
          id: nanoid(),
          title: "",
          type: "radio",
          required: false,
          options: [
            {
              id: nanoid(),
              text: "Варіант відповіді 1",
            },
          ],
        },
      }),
    },
    addOption: {
      reducer: (state, action) => {
        const question = state.questions.find(
          (q) => q.id === action.payload.questionId,
        );

        question.options.push(action.payload.option);
      },
      prepare: (questionId) => ({
        payload: {
          questionId,
          option: {
            id: nanoid(),
            text: "",
          },
        },
      }),
    },
    editOption: (state, action) => {
      const question = state.questions.find(
        (q) => q.id === action.payload.questionId,
      );

      const option = question.options.find(
        (opt) => opt.id === action.payload.optionId,
      );

      option.text = action.payload.text;
    },
    removeOption: (state, action) => {
      const question = state.questions.find(
        (q) => q.id === action.payload.questionId,
      );

      question.options = question.options.filter(
        (o) => o.id !== action.payload.optionId,
      );
    },
    editQuestion: (state, action) => {
      const question = state.questions.find((q) => q.id === action.payload.id);

      Object.assign(question, action.payload.changes);
    },
    removeQuestion: (state, action) => {
      const filtered = state.questions.filter(
        (q) => q.id !== action.payload.id,
      );

      return { ...state, questions: filtered };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveSurvey.fulfilled, () => {
      return initialState;
    });
  },
});

export const saveSurvey = createAsyncThunk(
  "survey/saveSurvey",
  async (action, { getState }) => {
    const survey = getState().survey;

    console.log(action);

    const response = await axios.post(
      `${SERVER_URL}/surveys/survey`,
      {
        ...survey,
        status: action.status === "publish" ? "published" : "draft",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      },
    );

    localStorage.removeItem("survey");
    return response.data;
  },
);

export const {
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
