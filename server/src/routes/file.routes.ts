import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  uploadFiles,
  getFiles,
  deleteFile,
} from "../controllers/file.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/upload", authenticate, upload.array("files", 10), uploadFiles);
router.get("/", authenticate, getFiles);
router.delete("/:id", authenticate, deleteFile);

export default router;
