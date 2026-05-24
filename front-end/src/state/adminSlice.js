import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  status: "none",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(patchUserRole.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(patchUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        const { userId, newRole } = action.payload;
        const userIndex = state.users.findIndex((user) => user._id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].role = newRole;
        }
      })
      .addCase(patchUserRole.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users");

      if (response.data.success) {
        return response.data.users;
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
            "Не вдалось отримати список користувачів"
        );
      }

      return rejectWithValue(
        error.message || "Не вдалось отримати список користувачів"
      );
    }
  }
);

export const patchUserRole = createAsyncThunk(
  "admin/patchUserRole",
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/user/${userId}/role`, {
        newRole: newRole,
      });

      if (response.data.success) {
        return { userId, newRole };
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Невдалось з'єднатись з сервером. Будь ласка, спробуйте пізніше"
        );
      }

      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Не вдалось змінити роль користувача"
        );
      }

      return rejectWithValue(
        error.message || "Не вдалось змінити роль користувача"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/user/${userId}`);

      if (response.status === 204) {
        return userId;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Невдалось з'єднатись з сервером. Будь ласка, спробуйте пізніше"
        );
      }

      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Не вдалось видалити користувача"
        );
      }

      return rejectWithValue(
        error.message || "Не вдалось видалити користувача"
      );
    }
  }
);

export default adminSlice.reducer;
