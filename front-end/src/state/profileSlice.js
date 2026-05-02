import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

const createInitialState = () => ({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  age: null,
  gender: "",
  userSurveys: [],
  passedSurveys: [],
  status: "none",
  surveysStatus: "none",
  passedSurveysStatus: "none",
  error: null,
  message: null,
  token: localStorage.getItem("token") || null,
  authChecked: false,
});

const initialState = createInitialState();

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setCreds: (state, action) => {
      const { firstName, lastName, email, role, age, gender } =
        action.payload.user;

      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.role = role;
      state.age = age ?? null;
      state.gender = gender ?? "";
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
        state.message = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.status = "success";
        console.log(action.payload);
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.age = action.payload.age ?? null;
        state.gender = action.payload.gender ?? "";

        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
        state.authChecked = true;
      })
      .addCase(me.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.token = null;
        localStorage.removeItem("token");
        state.authChecked = true;
      })

      .addCase(getUserSurveys.pending, (state) => {
        state.message = null;
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
        state.message = null;
        state.passedSurveysStatus = "loading";
      })
      .addCase(getSurveysPassedByUser.fulfilled, (state, action) => {
        state.passedSurveysStatus = "success";
        state.passedSurveys = action.payload;
      })
      .addCase(getSurveysPassedByUser.rejected, (state, action) => {
        state.passedSurveysStatus = "error";
        state.error = action.payload;
      })
      .addCase(editProfile.pending, (state) => {
        state.message = null;
        state.status = "loading";
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = "success";
        const { firstName, lastName, age, gender } = action.payload;
        state.firstName = firstName;
        state.lastName = lastName;
        state.age = age ?? null;
        state.gender = gender ?? "";
        state.message = "Профіль успішно оновлено";
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.message = null;
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "success";
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.message = null;
        state.status = "loading";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        return createInitialState();
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.message = null;
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        return createInitialState();
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "error";
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

export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (updateData, { rejectWithValue }) => {
    const { firstName, lastName, age, gender } = updateData;
    try {
      const response = await api.patch("/user/update", {
        firstName,
        lastName,
        age,
        gender,
      });

      if (response.data.success) {
        return response.data.user;
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Неможливо зберегти профіль. Спробуйте ще раз."
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (updateData, { rejectWithValue }) => {
    const { currentPassword, newPassword } = updateData;
    try {
      const response = await api.put("/user/password", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.data.success) {
        return response.data.message;
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Неможливо змінити пароль. Спробуйте ще раз."
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (data, { rejectWithValue }) => {
    const { password } = data;
    try {
      const response = await api.delete("/user", {
        data: { password: password },
      });

      if (response.data.success) {
        localStorage.removeItem("token");
        return "Акаунт успішно видалено";
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Неможливо видалити акаунт. Спробуйте ще раз."
      );
    }
  }
);

export const logout = createAsyncThunk(
  "profile/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");

      if (response.status === 204) {
        localStorage.removeItem("token");
        return "Ви успішно вийшли з акаунта";
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Неможливо вийти з акаунта. Спробуйте ще раз."
      );
    }
  }
);

export const { setCreds, setTokenFromAxios } = profileSlice.actions;
export default profileSlice.reducer;
