import { NextFunction } from "express";

import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";
import { blogService } from "../../services/common/blog-service";
import { createPayload, sanitizeArray } from "../../../../shared/utils/helper/common-functions";
import { categoryModule } from "../../../category/category-module";

export const adminBlogController = {
  async getBlogs(req: any, res: any, next: NextFunction) {
    try {
      const blogs = await blogService.findBlogs(req.query);

      return ResponseHandler.success({
        res,
        statusCode: 200,
        message: "Blogs fetched successfully",
        props: {
          total: blogs?.totalcount,
          limit: blogs?.limit,
          currentPage: Number(req.query.page || 1),
        },
        data: blogs?.data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createBlog(req: any, res: any, next: NextFunction) {
    try {
      const allowedTextFields = createPayload(req?.body, ["title", "content"]);
      const allowedImageFields = createPayload(req?.body?.images, ["thumbnail_image", "blog_image"]);

      let categorySlugsOrIds = sanitizeArray(req?.body?.categories);
      const tags = sanitizeArray(req?.body?.tags);

      const categoryObjectIds = await Promise.all(
        categorySlugsOrIds.map(async (cat) => {
          const category = await categoryModule.services.common.findCategory(cat);
          if (!category) {
            throw new Error(`Category not found for: ${cat}`);
          }
          return category._id;
        })
      );

      const payload = {
        ...allowedTextFields,
        ...allowedImageFields,
        categories: categoryObjectIds,
        tags,
        userDetails: req?.userDetails,
      };

      const blog = await blogService.createBlog(payload);

      return ResponseHandler.success({
        res,
        statusCode: 200,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  },
};
