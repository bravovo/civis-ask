import { configureStore } from "@reduxjs/toolkit";

import profileReducer from "./profileSlice";
import loaderReducer from "./loaderSlice";
import surveyReducer from "./surveySlice";
import surveyListReducer from "./surveysSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    loader: loaderReducer,
    survey: surveyReducer,
    surveyList: surveyListReducer,
  },
});
