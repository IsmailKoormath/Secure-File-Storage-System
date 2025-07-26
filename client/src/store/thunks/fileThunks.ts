
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { api } from "@/lib/api";

export const uploadFiles = createAsyncThunk<
  { files: any[]; errors?: any[] },
  File[],
  {
    state: RootState;
    rejectValue: string;
  }
>("file/uploadFiles", async (files, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const data = await api("/files/upload", {
      method: "POST",
      body: formData,
    });

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to upload files");
  }
});

export const fetchFiles = createAsyncThunk<
  any[],
  string | undefined,
  {
    state: RootState;
    rejectValue: string;
  }
>("file/fetchFiles", async (filter, { rejectWithValue }) => {
  try {
    const queryParams = filter ? `?type=${encodeURIComponent(filter)}` : "";
    const data = await api(`/files${queryParams}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch files");
  }
});

export const deleteFile = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("file/deleteFile", async (fileId, { rejectWithValue }) => {
  try {
    await api(`/files/${fileId}`, { method: "DELETE" });
    return fileId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete file");
  }
});
