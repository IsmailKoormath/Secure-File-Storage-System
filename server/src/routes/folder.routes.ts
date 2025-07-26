import express from 'express'
import { authenticate } from '../middlewares/auth.middleware';
import { createFolder, deleteFolder, getFolders, updateFolder } from '../controllers/folder.controller';

const router=express.Router()

router.post("/", authenticate, createFolder);
router.get("/", authenticate, getFolders);
router.put("/:folderId", authenticate, updateFolder);
router.delete("/:folderId", authenticate, deleteFolder);

export default router