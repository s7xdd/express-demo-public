import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  thumbnail_image: {
    type: String,
    required: true,
  },
  blog_image: {
    type: String,
    required: true,
  },
  is_published: {
    type: Boolean,
    default: true,
  },
  date_published: {
    type: Date,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    default: Date.now,
  },
});

export const BlogModel = mongoose.model("Blog", blogSchema);
