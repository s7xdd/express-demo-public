import { Router } from "express";

import { loginValidationSchema } from "../../valitdators/auth-validator";
import { validateData } from "../../../../shared/middlewares/common-middleware";
import { adminAuthController } from "../../controllers/admin/auth-controller-admin";

const adminAuthRoutes = Router();

adminAuthRoutes.use('/login', validateData(loginValidationSchema), adminAuthController.loginUser);

export default adminAuthRoutes;