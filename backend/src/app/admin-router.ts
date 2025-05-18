import express from "express";
import { authModule } from "../modules/auth/auth-module";
import { blogModule } from "../modules/blog/blog-module";

const adminRouter = express.Router();

adminRouter.use('/auth', authModule.routes.admin);
adminRouter.use('/blogs', blogModule.routes.admin);

export default adminRouter; 