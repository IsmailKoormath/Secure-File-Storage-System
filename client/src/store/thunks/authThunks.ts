import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {name, email, password }: {name:string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await api("/auth/register", {
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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return data;
    }  catch (err: unknown) {
  if (err instanceof Error) {
    return rejectWithValue(err.message);
  }
  return rejectWithValue("An unknown error occurred.");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api("/auth/refresh", {
        method: "GET",
      });
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Session expired. Please login again.");
    }
  }
);

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
