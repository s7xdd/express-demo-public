import { handleMongooseErrors } from "../../../shared/utils/helper/mongodb/mongo-functions";
import { productModel } from "../models/product-schema";

export const productService = {
  async findProductById({ id }: { id: string }) {
    try {
      const user = await productModel.findOne({ id });
      return user;
    } catch (error) {
      handleMongooseErrors(error);
    }
  },
};
