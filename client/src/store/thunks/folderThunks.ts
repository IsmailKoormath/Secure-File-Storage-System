import { api } from "@/lib/api";
import { RootState } from "../store";
import { Folder } from "../slices/folderSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchFolders = createAsyncThunk<
  Folder[],
  string | undefined, // parentId (optional)
  {
    state: RootState;
    rejectValue: string;
  }
>("folder/fetchFolders", async (parentId, { rejectWithValue }) => {
  try {
    const queryParams = parentId
      ? `?parentId=${encodeURIComponent(parentId)}`
      : "";
    const data = await api(`/folders${queryParams}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch folders");
  }
});

export const createFolder = createAsyncThunk<
  Folder,
  { name: string; parentId?: string | null; color?: string },
  {
    state: RootState;
    rejectValue: string;
  }
>("folder/createFolder", async (folderData, { rejectWithValue }) => {
  try {
    const data = await api("/folders", {
      method: "POST",
      body: JSON.stringify(folderData),
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create folder");
  }
});

export const updateFolder = createAsyncThunk<
  Folder,
  {
    folderId: string;
    updates: { name?: string; color?: string; parentId?: string | null };
  },
  {
    state: RootState;
    rejectValue: string;
  }
>("folder/updateFolder", async ({ folderId, updates }, { rejectWithValue }) => {
  try {
    const data = await api(`/folders/${folderId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update folder");
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
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete folder");
  }
});
