import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";
import { LoginInput, LoginResponse, RefreshTokenResponse, RegisterInput, RegisterResponse } from "@/types";


export const registerUser = createAsyncThunk<
  RegisterResponse, 
  RegisterInput,     
  {
    rejectValue: string;
  }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);



export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginInput,
  {
    rejectValue: string;
  }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await api<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred.");
  }
});



export const refreshToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  {
    rejectValue: string;
  }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const data = await api<RefreshTokenResponse>("/auth/refresh-token", {
      method: "GET",
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Token refresh failed");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api("/auth/logout", { method: "POST" });
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to logout.");
    }
  }
);
