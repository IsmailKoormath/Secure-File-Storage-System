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

export interface Folder {
  _id: string;
  name: string;
  userId: string;
  parentId: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
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

export interface CreateFolderData {
  name: string;
  color?: string;
  parentId?: string | null;
}
export interface UpdateFolderPayload {
  folderId: string;
  data: {
    name?: string;
    color?: string;
    parentId?: string | null;
  };
}
export interface UploadErrorItem {
  filename: string;
  error: string;
}
  
export interface RegisterResponse {
  email: string;
  accessToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
export interface RefreshTokenResponse {
  user: { email: string };
  token: string;
}
