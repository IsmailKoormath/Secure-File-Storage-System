import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import fileReducer from "./slices/fileSlice";
import folderReducer from "./slices/folderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    folders: folderReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
