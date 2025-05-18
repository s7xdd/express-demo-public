import { Router } from "express";

import { validateData } from "../../../../shared/middlewares/common-middleware";
import { frontendAuthController } from "../../controllers/frontend/auth-controller-frontend";
import { protectedRouteMiddleware } from "../../middleware/common/protected-route-middleware";
import { loginValidationSchema, registerValidationSchema, otpValidationSchema, resendOtpValidationSchema } from "../../valitdators/auth-validator";

const frontendAuthRoutes = Router();

frontendAuthRoutes.post("/register", validateData(registerValidationSchema), frontendAuthController.registerUser);
frontendAuthRoutes.post("/login", validateData(loginValidationSchema), frontendAuthController.loginUser);

//OTP Routes
frontendAuthRoutes.post("/verify-otp", validateData(otpValidationSchema), frontendAuthController.verifyOtp);
frontendAuthRoutes.post("/resend-otp", validateData(resendOtpValidationSchema), frontendAuthController.resendOtp);

frontendAuthRoutes.get("/user-details", protectedRouteMiddleware, frontendAuthController.getUserDetails);


export default frontendAuthRoutes;
