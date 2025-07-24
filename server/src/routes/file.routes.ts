import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/file.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadFile);
router.get("/", authenticate, getFiles);
router.delete("/:id", authenticate, deleteFile);

export default router;
