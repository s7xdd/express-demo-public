import { frontendCategoryController } from "./controller/frontend/category-controller-frontend";
import categoryFrontEndRoutes from "./routes/frontend/category-frontend-routes";
import { categoryService } from "./services/common/category-service";

export const categoryModule = {
  routes: {
    frontend: categoryFrontEndRoutes,
  },
  controller: {
    frontend: frontendCategoryController,
  },
  services: {
    common: categoryService,
  },
  middlewares: {},
};
