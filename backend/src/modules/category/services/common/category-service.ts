import mongoose from "mongoose";

import { buildQueryFromRules, sluggify } from "../../../../shared/utils/helper/common-functions";
import { handleMongooseErrors } from "../../../../shared/utils/helper/mongodb/mongo-functions";
import { CategoryModel } from "../../models/category-schema";
import { QueryRuleProps } from "../../../../shared/utils/types/common-types";

export const categoryService = {
  async createCategory(categoryData: { category_title: string }) {
    try {
      const slug: any = sluggify(categoryData.category_title);

      const existing = await CategoryModel.findOne({ slug });
      if (existing) {
        throw new Error("Category with this title already exists.");
      }

      const category = new CategoryModel({
        category_title: categoryData.category_title.trim(),
        slug,
      });

      return await category.save();
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async findCategory(id: string) {
    try {
      return await CategoryModel.findById(id);
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async findCategories(queryParams: any) {
    try {
      const queryRules: QueryRuleProps[] = [
        { key: "category_title", type: "regex" },
        { key: "_id", type: "string" },
      ];

      const query = { ...buildQueryFromRules(queryParams, queryRules) };

      const categories = await CategoryModel.find(query).sort({ date_published: -1 });

      const totalCategories = await CategoryModel.countDocuments(query);

      return {
        totalcount: totalCategories,
        categories,
      };
    } catch (error) {
      handleMongooseErrors(error);
    }
  },
};
