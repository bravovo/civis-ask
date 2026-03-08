import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import loaderReducer from "./loaderSlice";
import surveyReducer from "./surveySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        loader: loaderReducer,
        survey: surveyReducer,
    },
});
