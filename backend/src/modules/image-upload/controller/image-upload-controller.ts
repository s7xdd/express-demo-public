import path from "path";
import fs from "fs/promises";
import { processImage } from "../config/processor";

interface ProcessedImages {
  [key: string]: string;
}

export const handleUploadedFiles = async (req: any, outputDir: string): Promise<ProcessedImages> => {
  if (!req.files) {
    throw new Error("No files uploaded");
  }

  const processedImages: ProcessedImages = {};

  for (const fieldName in req.files) {
    const files = req.files[fieldName] as Express.Multer.File[];
    if (files && files.length > 0) {
      const inputPath = files[0].path;
      const outputPath = path.join(outputDir, files[0].filename);

      await processImage(inputPath, outputPath);
      
      processedImages[fieldName] = `/uploads/blog-uploads/${files[0].filename}`;

      await fs.unlink(inputPath);
    }
  }

  return processedImages;
};
