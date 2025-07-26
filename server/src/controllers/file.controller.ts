import { Request, Response } from "express";
import { uploadFileToS3, deleteFileFromS3 } from "../services/s3.service";
import { FileModel } from "../models/File";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const uploadFiles = async (req: AuthenticatedRequest, res: Response) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files provided" });
    }
  
    const userId = req.userId!;
    const uploadedFiles = [];
    const errors = [];
  
    try {
      // Process each file
      for (const file of files) {
        try {
          const { originalname, mimetype, size, buffer } = file;
          console.log("Processing file:", originalname);
  
          // Upload to S3
          const { key, url } = await uploadFileToS3(
            buffer,
            originalname,
            mimetype,
            userId
          );
  
          // Save to database
          const savedFile = await FileModel.create({
            filename: originalname,
            key,
            url,
            mimetype,
            size,
            userId,
          });
  
          uploadedFiles.push(savedFile);
        } catch (error) {
          console.error(`Error uploading file ${file.originalname}:`, error);
          errors.push({
            filename: file.originalname,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
  
      // Return response with results
      if (uploadedFiles.length === 0) {
        return res.status(400).json({
          message: "All file uploads failed",
          errors,
        });
      }
  
      if (errors.length > 0) {
        return res.status(207).json({
          message: `${uploadedFiles.length} files uploaded successfully, ${errors.length} failed`,
          files: uploadedFiles,
          errors,
        });
      }
  
      res.status(201).json({
        message: `${uploadedFiles.length} files uploaded successfully`,
        files: uploadedFiles,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: "Server error during upload",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
  
  // Keep the single file upload for backward compatibility (optional)
  export const uploadFile = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const { originalname, mimetype, size, buffer } = req.file;
    const userId = req.userId!;
    console.log("originalname", originalname);
   
    try {
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
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: "Failed to upload file",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

export const getFiles = async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.query;
  const query: any = { userId: req.userId };

  if (type) {
    const mimetypeRegex = new RegExp(`^${type}`, "i"); 
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
