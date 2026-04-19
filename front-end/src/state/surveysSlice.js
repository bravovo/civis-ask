import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

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
      });
  },
});

export const getPublishedSurveys = createAsyncThunk(
  "surveyList/getPublishedSurveys",
  async (_, { rejectWithValue }) => {
    try {
      console.log("FROM DB");
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
  },
  {
    condition: (_, { getState }) => {
      const { surveyList } = getState();
      if (surveyList.status === "loading" || surveyList.items.length > 0) {
        console.log("FROM CACHE");
        return false;
      }
    },
  }
);

export default surveysSlice.reducer;
