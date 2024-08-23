import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction(state, action: PayloadAction<{ user: any; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutAction(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setUserAction(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setTokenAction(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setTemporaryUsernameActions(state, action: PayloadAction<string>) {
      state.user = { username: action.payload };
    },
  },
});

export const {
  loginAction,
  logoutAction,
  setUserAction,
  setTokenAction,
  setTemporaryUsernameActions,
} = authSlice.actions;
export default authSlice.reducer;
