export interface FileType {
  _id: string;
  filename: string;
  key: string;
  url: string;
  mimetype: string;
  size: number;
  userId: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UploadSuccessItem {
  _id: string;
  filename: string;
  key: string;
  url: string;
  mimetype: string;
  size: number;
  userId: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadErrorItem {
  filename: string;
  error: string;
}
  