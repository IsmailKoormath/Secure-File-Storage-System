
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { api } from "@/lib/api";
import { FileType, UploadErrorItem } from "@/types";

export const uploadFiles = createAsyncThunk<
  { files: FileType[]; errors?: UploadErrorItem[] },
  File[],
  { state: RootState; rejectValue: string }
>("file/uploadFiles", async (files, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const data = await api<{ files: FileType[]; errors?: UploadErrorItem[] }>(
      "/files/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    return {
      files: data.files || [],
      errors: data.errors || [],
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("An unknown error occurred.");
  }
});

export const fetchFiles = createAsyncThunk<
  FileType[], 
  string | undefined, 
  {
    state: RootState;
    rejectValue: string;
  }
>("file/fetchFiles", async (filter, { rejectWithValue }) => {
  try {
    const queryParams = filter ? `?type=${encodeURIComponent(filter)}` : "";
    const data = await api<FileType[]>(`/files${queryParams}`);
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to fetch files");
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue( "Failed to delete file");
  }
});
