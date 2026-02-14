import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_URL } from "../../config/env";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    authChecked: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCreds: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem("token", action.payload.token);
            state.authChecked = true;
        },
        logout: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(me.fulfilled, (state, action) => {
                state.user = action.payload.user;

                if (action.payload.token) {
                    state.token = action.payload.token;
                    localStorage.setItem("token", action.payload.token);
                }
                state.authChecked = true;
            })
            .addCase(me.rejected, (state) => {
                state.user = null;
                state.token = null;
                localStorage.removeItem("token");
                state.authChecked = true;
            });
    },
});

export const me = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${SERVER_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                return response.data;
            }
        } catch (error) {
            console.log(error.response || error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const { setCreds, logout } = authSlice.actions;

export default authSlice.reducer;
