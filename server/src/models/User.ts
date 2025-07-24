import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema
);
