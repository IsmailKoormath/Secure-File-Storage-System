import mongoose from "mongoose";
import { fileSchema } from "./File";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    color: { type: String, default: "#3B82F6" },
  },
  { timestamps: true }
);
  

folderSchema.index({ name: 1, userId: 1, parentId: 1 }, { unique: true });

export const FolderModel = mongoose.model("Folder", folderSchema);
export const FileModel = mongoose.model("File", fileSchema);
