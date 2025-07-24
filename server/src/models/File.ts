import { Schema, model, Document, Types } from "mongoose";

export interface IFile extends Document {
  filename: string;
  key: string;
  url: string;
  mimetype: string;
  size: number;
  userId: Types.ObjectId;
  createdAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    filename: { type: String, required: true },
    key: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const FileModel = model<IFile>("File", fileSchema);
