import { createSlice } from "@reduxjs/toolkit";
import { createFolder, deleteFolder, fetchFolders, updateFolder } from "../thunks/folderThunks";
import { FileType, Folder } from "@/types";




const initialState = {
  files: [] as FileType[],
  folders: [] as Folder[],
  currentFolderId: null as string | null,
  folderPath: [] as Folder[],
  folderLoading: false,
  error: null as string | null,
};
  
  const FolderSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
      clearFiles(state) {
        state.files = [];
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchFolders.pending, (state) => {
          state.folderLoading = true;
          state.error = null;
        })
        .addCase(fetchFolders.fulfilled, (state, action) => {
          state.folderLoading = false;
          state.folders = action.payload;
        })
        .addCase(fetchFolders.rejected, (state, action) => {
          state.folderLoading = false;
          state.error = (action.payload as string) || "Failed to fetch folders";
        })

        .addCase(createFolder.fulfilled, (state, action) => {
          state.folders.push(action.payload);
        })

        .addCase(updateFolder.fulfilled, (state, action) => {
          const index = state.folders.findIndex(
            (f) => f._id === action.payload._id
          );
          if (index !== -1) {
            state.folders[index] = action.payload;
          }
        })

        .addCase(deleteFolder.fulfilled, (state, action) => {
          state.folders = state.folders.filter((f) => f._id !== action.payload);
        });
    },
  });

export default FolderSlice.reducer