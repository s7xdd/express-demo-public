import { Router } from "express";
import { checkoutController } from "../controllers/checkout-controller";
import { validateData } from "../../../shared/middlewares/common-middleware";
import { checkoutValidationSchema } from "../types/checkout-types";
import { authModule } from "../../auth/auth-module";

const checkoutRoutes = Router();

checkoutRoutes.post("/create-checkout-session", authModule.middlewares.protectedroute_passport, validateData(checkoutValidationSchema), checkoutController.createCheckoutSession);



export default checkoutRoutes;
