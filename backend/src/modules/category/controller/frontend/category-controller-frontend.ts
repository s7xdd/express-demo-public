import { NextFunction } from "express";
import { categoryService } from "../../services/common/category-service";
import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";

export const frontendCategoryController = {
  async getCategories(req: any, res: any, next: NextFunction) {
    try {
      const categoriesData = await categoryService.findCategories(req.query);

      return ResponseHandler.success({
        res,
        statusCode: 200,
        message: "Categories fetched successfully",
        data: categoriesData?.categories,
        totalCount: categoriesData?.totalcount,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategory(req: any, res: any, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await categoryService.findCategory(id);

      return ResponseHandler.success({
        res,
        statusCode: 200,
        message: "Category fetched successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },
};
