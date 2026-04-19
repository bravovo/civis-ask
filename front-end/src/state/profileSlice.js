import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  userSurveys: [],
  passedSurveys: [],
  status: "none",
  surveysStatus: "none",
  passedSurveysStatus: "none",
  error: null,
  token: localStorage.getItem("token") || null,
  authChecked: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    logout: (_state) => {
      localStorage.removeItem("token");
      return initialState;
    },
    setCreds: (state, action) => {
      const { firstName, lastName, email, role } = action.payload.user;

      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.role = role;
      state.token = action.payload.token;

      state.status = "success";

      localStorage.setItem("token", action.payload.token);
      state.authChecked = true;
    },
    setTokenFromAxios: (state, action) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(me.pending, (state) => {
        state.status = "loading";
      })
      .addCase(me.fulfilled, (state, action) => {
        state.status = "success";
        console.log(action.payload);
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.role = action.payload.role;

        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
        state.authChecked = true;
      })
      .addCase(me.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        localStorage.removeItem("token");
        state.authChecked = true;
      })

      .addCase(getUserSurveys.pending, (state) => {
        state.surveysStatus = "loading";
      })
      .addCase(getUserSurveys.fulfilled, (state, action) => {
        state.surveysStatus = "success";
        state.userSurveys = action.payload;
      })
      .addCase(getUserSurveys.rejected, (state, action) => {
        state.surveysStatus = "error";
        state.error = action.payload;
      })

      .addCase(getSurveysPassedByUser.pending, (state) => {
        state.passedSurveysStatus = "loading";
      })
      .addCase(getSurveysPassedByUser.fulfilled, (state, action) => {
        state.passedSurveysStatus = "success";
        state.passedSurveys = action.payload;
      })
      .addCase(getSurveysPassedByUser.rejected, (state, action) => {
        state.passedSurveysStatus = "error";
        state.error = action.payload;
      });
  },
});

export const me = createAsyncThunk(
  "profile/me",
  async (_, { rejectWithValue }) => {
    try {
      console.log("PROFILE FROM DB");
      const response = await api.get(`/user/me`);

      if (response.data.success) {
        return response.data.user;
      }
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Помилка авторизації"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { profile } = getState();
      if (profile.status === "loading" || profile.email) {
        console.log("PROFILE FROM CACHE");
        return false;
      }
    },
  }
);

export const getUserSurveys = createAsyncThunk(
  "profile/getUserSurveys",
  async (_, { rejectWithValue }) => {
    try {
      console.log("USER SURVEYS FROM DB");
      const response = await api.get(`/surveys/user-surveys`);

      if (response.data.success) {
        return response.data.surveys;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка отримання списку"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { profile } = getState();
      if (
        profile.surveysStatus === "loading" ||
        profile.userSurveys.length > 0
      ) {
        console.log("USER SURVEYS FROM CACHE");
        return false;
      }
    },
  }
);

export const getSurveysPassedByUser = createAsyncThunk(
  "profile/getSurveysPassedByUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("SURVEYS PASSED BY USER FROM DB");
      const response = await api.get(`/surveys/user-passed-surveys`);

      if (response.data.success) {
        return response.data.surveys;
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Помилка отримання списку"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { profile } = getState();
      if (
        profile.passedSurveysStatus === "loading" ||
        profile.passedSurveys.length > 0
      ) {
        console.log("SURVEYS PASSED BY USER FROM CACHE");
        return false;
      }
    },
  }
);

export const { logout, setCreds, setTokenFromAxios } = profileSlice.actions;
export default profileSlice.reducer;
