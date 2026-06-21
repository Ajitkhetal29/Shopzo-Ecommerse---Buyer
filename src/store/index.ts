import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import generalReducer from "./slices/generalSlice";
import cartReducer from "./slices/cartSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    general: generalReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
