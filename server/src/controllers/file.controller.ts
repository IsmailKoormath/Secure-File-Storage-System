import { Request, Response } from "express";
import { uploadFileToS3, deleteFileFromS3 } from "../services/s3.service";
import { FileModel } from "../models/File";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  const { originalname, mimetype, size, buffer } = req.file;
  const userId = req.userId!;

  const { key, url } = await uploadFileToS3(
    buffer,
    originalname,
    mimetype,
    userId
  );

  const file = await FileModel.create({
    filename: originalname,
    key,
    url,
    mimetype,
    size,
    userId,
  });

  res.status(201).json(file);
};

export const getFiles = async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.query;
  const query: any = { userId: req.userId };

  if (type) {
    const mimetypeRegex = new RegExp(`^${type}`, "i"); // e.g., image → image/*
    query.mimetype = mimetypeRegex;
  }

  const files = await FileModel.find(query).sort({ createdAt: -1 });
  res.json(files);
};
  

export const deleteFile = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const file = await FileModel.findOne({ _id: id, userId: req.userId });

  if (!file) return res.status(404).json({ message: "File not found" });

  await deleteFileFromS3(file.key);
  await file.deleteOne();

  res.json({ message: "File deleted" });
};
