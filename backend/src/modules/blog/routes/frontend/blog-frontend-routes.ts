import { Router } from "express";
import { frontendBlogController } from "../../controllers/frontend/blog-frontend-controller";


const blogFrontEndRoutes = Router();

blogFrontEndRoutes.get("/", frontendBlogController.getBlogs);

export default blogFrontEndRoutes;
