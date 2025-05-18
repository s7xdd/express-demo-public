import { handleMongooseErrors } from "../../../../shared/utils/helper/mongodb/mongo-functions";
import { UserModel } from "../../models/user-schema";

export const userService = {
  async findUserByUsername({ username }: { username: string }) {
    try {
      const user = await UserModel.findOne({ username });
      return user;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async findUserById({ _id }: { _id: string }) {
    try {
      const user = await UserModel.findById({ _id });
      return user;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async findUserByEmail({ email }: { email: string }) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async createUser(userData: any) {
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async updateUser(_id: string, customerData: any) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(_id, customerData, { new: true });
      return updatedUser;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },

  async updateBlogCount({ _id, addBlog = true }: { _id: string; addBlog?: boolean }) {
    try {
      const user: any = await this.findUserById({ _id });
      const newBlogCount = Math.max(addBlog ? user.total_blogs + 1 : user.total_blogs - 1, 0);

      await user.updateOne({ total_blogs: newBlogCount });
    } catch (error) {
      handleMongooseErrors(error);
    }
  },
};
