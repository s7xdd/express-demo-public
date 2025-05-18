import sharp from "sharp";
import fs from "fs/promises";

export const processImage = async (inputPath: string, outputPath: string): Promise<void> => {
  await sharp(inputPath).resize(1920, 1080, { fit: "inside" }).webp({ quality: 80 }).toFile(outputPath);
};

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
  }
};
