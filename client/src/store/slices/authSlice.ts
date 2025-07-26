import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../thunks/authThunks";

interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{ email: User; accessToken: string }>
        ) => {
          state.loading = false;
          state.user = action.payload.email;
          state.token = action.payload.accessToken;
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ email: User; accessToken: string }>) => {
          state.loading = false;
          state.user = action.payload.email;
          state.token = action.payload.accessToken;
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Refresh
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;
