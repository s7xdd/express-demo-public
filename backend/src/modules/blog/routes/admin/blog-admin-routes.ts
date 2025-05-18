import { Router } from "express";

import { validateData } from "../../../../shared/middlewares/common-middleware";
import { createBlogValidationSchema } from "../../validators/blog-validators";
import { PERMISSION_BLOCKS } from "../../../auth/constants/admin/auth-constants";
import { adminBlogController } from "../../controllers/admin/blog-admin-controller";
import { imageUploadModule } from "../../../image-upload/image-upload-module";
import { authModule } from "../../../auth/auth-module";

const blogImageFields = [
  { name: "thumbnail_image", maxCount: 1, required: true },
  { name: "blog_image", maxCount: 1, required: true }
];

const blogAdminRoutes = Router();

blogAdminRoutes.use(authModule.middlewares.protectedroute);
blogAdminRoutes.use(authModule.middlewares.permission({ requiredPermission: PERMISSION_BLOCKS.admin }));

blogAdminRoutes.get("/", adminBlogController.getBlogs);

blogAdminRoutes.post(
  "/create-blog",
  imageUploadModule.middleware.uploadMiddleware(blogImageFields, "public/uploads/blog-uploads"),
  validateData(createBlogValidationSchema),
  adminBlogController.createBlog
);

export default blogAdminRoutes;
