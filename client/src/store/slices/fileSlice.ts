import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchFiles, uploadFiles } from "../thunks/fileThunks";
import { FileType, UploadErrorItem } from "@/types";



interface FileState {
  files: FileType[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
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
      // Fetch
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFiles.fulfilled,
        (state, action: PayloadAction<FileType[]>) => {
          state.loading = false;
          state.files = action.payload;
        }
      )
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch files";
      })

      // Upload
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadFiles.fulfilled,
        (
          state,
          action: PayloadAction<{
            files: FileType[];
            errors?: UploadErrorItem[];
          }>
        ) => {
          state.loading = false;
          if (action.payload.files && action.payload.files.length > 0) {
            state.files.unshift(...action.payload.files);
          }
          if (action.payload.errors && action.payload.errors.length > 0) {
            state.error = `${action.payload.errors.length} files failed to upload`;
          }
        }
      )
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "File upload failed";
      });
  },
});

export const { clearFiles } = fileSlice.actions;
export default fileSlice.reducer;
