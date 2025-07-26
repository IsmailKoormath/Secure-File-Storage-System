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
