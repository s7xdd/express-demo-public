import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";

import { createMulterInstance } from "../config/multer-config";
import { handleUploadedFiles } from "../controller/image-upload-controller";

export const uploadMiddleware = (
  fields: { name: string; maxCount?: number; required: boolean }[],
  outputDir: string
) => {
  const multerInstance = createMulterInstance(fields);

  return [
    multerInstance,

    async (req: any, res: Response, next: NextFunction): Promise<void> => {

      for (const field of fields) {
        if (!req?.files?.[field.name] && field.required) {
          throw new Error(`No file uploaded for field: ${field.name}`);
        }
      }

      try {
        req.body.images = await handleUploadedFiles(req, outputDir);
        next();
      } catch (error) {
        next(error);
      }
    },
  ];
};
