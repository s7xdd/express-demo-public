import { Router } from "express";
import { frontendCategoryController } from "../../controller/frontend/category-controller-frontend";

const categoryFrontEndRoutes = Router();

categoryFrontEndRoutes.get("/", frontendCategoryController.getCategories);
categoryFrontEndRoutes.get("/:id", frontendCategoryController.getCategory);

export default categoryFrontEndRoutes;
