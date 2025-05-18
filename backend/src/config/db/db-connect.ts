import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    return "Database connected";
  } catch (error) {
    console.log(error);
    return "Error connecting to database";
  }
};

export { connectDb };
