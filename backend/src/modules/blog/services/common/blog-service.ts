import { handleMongooseErrors } from "../../../../shared/utils/helper/mongodb/mongo-functions";
import { BlogModel } from "../../models/blog-schema";
import { sluggify } from "../../../../shared/utils/helper/common-functions";

export const blogService = {
  async findBlogById({ _id }: { _id: string }) {
    try {
      const blog = await BlogModel.findOne({ _id });
      return blog;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async createBlog(payload: any) {
    try {
      const blog = new BlogModel({
        slug: sluggify(payload?.title),
        author_id: payload.userDetails._id,
        ...payload,
      });

      await blog.save();

      return blog;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async findBlogs(query: any, skip = 0, limit = 10) {
    try {
      const blogs = await BlogModel.find(query).sort({ date_published: -1 }).skip(skip).limit(limit);

      const totalBlogs = await BlogModel.countDocuments(query);

      return {
        totalcount: totalBlogs,
        limit,
        data: {
          blogs,
        },
      };
    } catch (error) {
      handleMongooseErrors(error);
    }
  },
};
