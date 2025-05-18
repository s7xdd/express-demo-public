import { Router } from "express";

import { blogModule } from "../modules/blog/blog-module";
import { authModule } from "../modules/auth/auth-module";
import { categoryModule } from "../modules/category/category-module";
import { checkoutModule } from "../modules/checkout/checkout-module";

const frontEndRouter = Router();

//NORMAL AUTH
frontEndRouter.use("/v1/auth", authModule.routes.v1);

//PASSPORT AUTH
frontEndRouter.use("/v2/auth", authModule.routes.v2);

//STRIPE PAYMENT
frontEndRouter.use("/v1/checkout", checkoutModule.routes.v1);

frontEndRouter.use("/v1/user-details", authModule.routes.v1);
frontEndRouter.use("/v1/blogs", blogModule.routes.frontend);
frontEndRouter.use("/v1/categories", categoryModule.routes.frontend);

export default frontEndRouter;
