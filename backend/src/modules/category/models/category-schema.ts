import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    category_title: {
        type: String,
        required: true,
        trim: true,
    },
})

export const CategoryModel = mongoose.model("Category", categorySchema) 