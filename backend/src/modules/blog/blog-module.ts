import { adminBlogController } from "./controllers/admin/blog-admin-controller";
import { frontendBlogController } from "./controllers/frontend/blog-frontend-controller";

import blogAdminRoutes from "./routes/admin/blog-admin-routes";
import blogFrontEndRoutes from "./routes/frontend/blog-frontend-routes";

import { blogService } from "./services/common/blog-service";

export const blogModule = {
  routes: {
    admin: blogAdminRoutes,
    frontend: blogFrontEndRoutes,
  },
  controllers: {
    frontend: frontendBlogController,
    admin: adminBlogController,
  },
  services: {
    common: blogService,
  },
};
