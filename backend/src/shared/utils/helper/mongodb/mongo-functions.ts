import mongoose from "mongoose";
export const handleMongooseErrors = (error: any) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const validationErrors = Object.values(error.errors).map((err) => err.message);
    throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
  } else if (error instanceof mongoose.Error.CastError) {
    throw new Error(`Invalid ${error.path}: ${error.value}`);
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyValue).join(", ");
    throw new Error(`Duplicate field value: ${field} already exists.`);
  } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
    throw new Error("Document not found");
  } else if (error instanceof mongoose.Error.MissingSchemaError) {
    throw new Error("Schema not found for the requested operation");
  } else {
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};
