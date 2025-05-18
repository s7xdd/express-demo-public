import { uploadMiddleware } from "./middlewares/upload-middleware";

export const imageUploadModule = {
  middleware: {
    uploadMiddleware: uploadMiddleware,
  },
};
