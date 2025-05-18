import mongoose, { Schema, Document } from "mongoose";
import { UserProps } from "../types/auth-types";

const userSchema: Schema<UserProps> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  total_blogs: {
    type: Number,
    default: 0,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    required: true,
  },
  otp_expiry: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  avatar_url: {
    type: String,
    default: "",
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  date_registered: {
    type: Date,
    default: Date.now,
  },
  is_google: {
    type: Boolean,
    default: false, 
  },
});

export const UserModel = mongoose.model<UserProps>("User", userSchema);
