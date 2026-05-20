import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import axios from "axios";
import { logout } from "./profileSlice";

const initialState = {
  items: [],
  status: "none",
  error: null,
};

const surveysSlice = createSlice({
  name: "surveyList",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getPublishedSurveys.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPublishedSurveys.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(getPublishedSurveys.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, () => {
        return initialState;
      });
  },
});

export const getPublishedSurveys = createAsyncThunk(
  "surveyList/getPublishedSurveys",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/surveys`);

      if (response.status === 200) {
        return response.data.surveys;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Помилка отримання опитувань. Будь ласка, спробуйте ще раз пізніше"
      );
    }
  }
);

export const deleteSurvey = createAsyncThunk(
  "survey/deleteSurvey",
  async (surveyId, { rejectWithValue }) => {
    try {
      if (!surveyId) {
        return rejectWithValue("Невідомий ID опитування");
      }

      const response = await api.delete(`/surveys/survey/${surveyId}`);

      if (response.status === 204) {
        return surveyId;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Невдалось з'єднатись з сервером. Будь ласка, спробуйте пізніше"
        );
      }

      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message ||
            "Не вдалось видалити опитування. Спробуйте ще раз"
        );
      }

      return rejectWithValue(
        error.message || "Не вдалось видалити опитування. Спробуйте ще раз"
      );
    }
  }
);

export default surveysSlice.reducer;
