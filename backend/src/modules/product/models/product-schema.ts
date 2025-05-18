import mongoose, { Schema, Document } from "mongoose";
import { ProductProps } from "../types/product-types";

const productSchema: Schema<ProductProps> = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export const productModel = mongoose.model<ProductProps>("Product", productSchema);
