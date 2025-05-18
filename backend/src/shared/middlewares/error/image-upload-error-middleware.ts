import { Request, Response, NextFunction } from "express";

export const imageUploadErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.message);

  if (err.message === "INVALID_FILE_TYPE") {
    res.status(400).json({ error: "Unsupported file format" });
  } else if (err.message === "LIMIT_FILE_SIZE") {
    res.status(400).json({ error: "File size exceeds limit" });
  } else if (err.message === "No file uploaded") {
    res.status(400).json({ error: "No file was uploaded" });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
};
