import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FileModel } from "../models/File";
import { FolderModel } from "../models/Folder";
import { Response } from "express";

export const createFolder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, parentId, color } = req.body;
    const userId = req.userId!;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const existingFolder = await FolderModel.findOne({
      name: name.trim(),
      userId,
      parentId: parentId || null,
    });

    if (existingFolder) {
      return res
        .status(400)
        .json({ message: "Folder with this name already exists" });
    }

    if (parentId) {
      const parentFolder = await FolderModel.findOne({ _id: parentId, userId });
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = await FolderModel.create({
      name: name.trim(),
      userId,
      parentId: parentId || null,
      color: color || "#3B82F6",
    });

    res.status(201).json(folder);
  } catch (error: any) {
    console.error("Create folder error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create folder" });
  }
};

export const getFolders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { parentId } = req.query;
    const userId = req.userId!;

    const folders = await FolderModel.find({
      userId,
      parentId: parentId || null,
    }).sort({ name: 1 });

    res.json(folders);
  } catch (error: any) {
    console.error("Get folders error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch folders" });
  }
};

export const updateFolder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { folderId } = req.params;
    const { name, color, parentId } = req.body;
    const userId = req.userId!;

    const folder = await FolderModel.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (name && name !== folder.name) {
      const existingFolder = await FolderModel.findOne({
        name: name.trim(),
        userId,
        parentId: parentId !== undefined ? parentId || null : folder.parentId,
        _id: { $ne: folderId },
      });

      if (existingFolder) {
        return res
          .status(400)
          .json({ message: "Folder with this name already exists" });
      }
    }

    if (parentId !== undefined && parentId) {
      const parentFolder = await FolderModel.findOne({ _id: parentId, userId });
      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
      if (parentId === folderId) {
        return res
          .status(400)
          .json({ message: "Cannot move folder into itself" });
      }
    }

    const updatedFolder = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        ...(name && { name: name.trim() }),
        ...(color && { color }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json(updatedFolder);
  } catch (error: any) {
    console.error("Update folder error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update folder" });
  }
};

export const deleteFolder = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { folderId } = req.params;
    const userId = req.userId!;

    const folder = await FolderModel.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const filesCount = await FileModel.countDocuments({ folderId, userId });
    if (filesCount > 0) {
      return res
        .status(400)
        .json({
          message:
            "Cannot delete folder that contains files. Move or delete files first.",
        });
    }

    const subfoldersCount = await FolderModel.countDocuments({
      parentId: folderId,
      userId,
    });
    if (subfoldersCount > 0) {
      return res
        .status(400)
        .json({
          message:
            "Cannot delete folder that contains subfolders. Delete subfolders first.",
        });
    }

    await FolderModel.findByIdAndDelete(folderId);
    res.json({ message: "Folder deleted successfully" });
  } catch (error: any) {
    console.error("Delete folder error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete folder" });
  }
};
