import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import keywordSlice from "./keyword/keywordSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  keyword: keywordSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true }),
});

export default store;
