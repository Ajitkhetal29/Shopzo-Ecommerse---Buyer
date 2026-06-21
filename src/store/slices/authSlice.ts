import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NamedRef =
  | string
  | {
      _id?: string;
      name?: string;
      code?: string;
    };

export type Buyer = {
  _id: string;
  name: string;
  email: string;
  department?: NamedRef;
  role?: NamedRef;
  isActive?: boolean;
};

type AuthState = {
  buyer: Buyer | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  buyer: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setBuyer(state, action: PayloadAction<Buyer>) {
      state.buyer = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.buyer = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setBuyer, logout } = authSlice.actions;
export default authSlice.reducer;
