import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import generalReducer from "./slices/generalSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    general: generalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
