import { api } from "@/lib/api";
import { RootState } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateFolderData, Folder, UpdateFolderPayload } from "@/types";


interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const fetchFolders = createAsyncThunk<
  Folder[], 
  void,
  { rejectValue: string }
>("folders/fetchFolders", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/folders");
    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Failed to fetch folders");
    }
    const data: Folder[] = await res.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unknown error");
  }
});

export const createFolder = createAsyncThunk<
  Folder, // Return newly created folder
  CreateFolderData, 
  { rejectValue: string }
>("folders/createFolder", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Failed to create folder");
    }

    const newFolder: Folder = await res.json();
    return newFolder;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unknown error");
  }
});



export const updateFolder = createAsyncThunk<
  Folder, 
  UpdateFolderPayload, 
  { rejectValue: string }
>("folders/updateFolder", async ({ folderId, data }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/folders/${folderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Failed to update folder");
    }

    const updatedFolder: Folder = await res.json();
    return updatedFolder;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unknown error");
  }
});


export const deleteFolder = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("folder/deleteFolder", async (folderId, { rejectWithValue }) => {
  try {
    await api(`/folders/${folderId}`, { method: "DELETE" });
    return folderId;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue( "Failed to delete folder");
  }
});
