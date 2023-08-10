import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import jobsReducer from "./JobsSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
  },
});
