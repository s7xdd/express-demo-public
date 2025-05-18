import { Document } from "mongoose";

export interface ProductProps extends Document {
  _id: string;
  title: string;
  price: number;
}
