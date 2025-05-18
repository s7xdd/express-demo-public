import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.resolve("public/uploads/temp");
    fs.mkdirSync(tempPath, { recursive: true });
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

export const createMulterInstance = (fields: { name: string; maxCount?: number }[]) =>
  multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).fields(fields);
