import { NextFunction } from "express";

import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";
import { blogService } from "../../services/common/blog-service";
import { QueryRuleProps } from "../../../../shared/utils/types/common-types";
import { buildQueryFromRules } from "../../../../shared/utils/helper/common-functions";

export const frontendBlogController = {
  async getBlogs(req: any, res: any, next: NextFunction) {
    try {
      const queryRules: QueryRuleProps[] = [
        { key: "title", type: "regex" },
        { key: "author_id", type: "string" },
        { key: "categories", type: "array" },
        { key: "tags", type: "array" },
        { key: "is_published", type: "boolean" },
        { key: "keyword", type: "search" },
      ];

      const query = buildQueryFromRules(req.query, queryRules);

      const limit = parseInt(req?.query?.limit, 10) || 10;
      const page = parseInt(req?.query?.page, 10) || 1;
      const skip = (page - 1) * limit;

      const blogs = await blogService.findBlogs(query, skip, limit);

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
};
