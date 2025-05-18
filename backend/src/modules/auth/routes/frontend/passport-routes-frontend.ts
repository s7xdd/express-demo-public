import express from "express";
import passport from "passport";

import "../../strategies/local-strategy";
import "../../strategies/google-strategy";

import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";
import { validateData } from "../../../../shared/middlewares/common-middleware";
import { passportController } from "../../controllers/frontend/passport-controller-frontend";
import { protectRouteMiddlewarePassport } from "../../middleware/common/protected-route-middlware-passport";
import {
  otpValidationSchema,
  registerValidationSchema,
  resendOtpValidationSchema,
} from "../../valitdators/auth-validator";

const passportRoutes = express.Router();


//REGISTER AND LOGIN ROUTES
passportRoutes.post("/register", validateData(registerValidationSchema), passportController.registerUser);
passportRoutes.post("/login", async (req, res, next) => {
  passport.authenticate("local", { session: true }, async (err: any, user: any, info: any) => {
    if (err) return next(err);

    if (!user) {
      if (info?.message === "User not verified") {
        return passportController.login(req, res, next);
      }

      return ResponseHandler.error({
        res,
        statusCode: 401,
        message: info?.message || "Authentication failed",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return ResponseHandler.success({
        res,
        data: req.user,
        message: "Login successful",
      });
    });
  })(req, res, next);
});


//PASSPORT GOOGLE LOGIN ROUTES
passportRoutes.get("/google-login", passportController.googleLogin);
passportRoutes.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
passportRoutes.get(
  "/google/callback",
  passport.authenticate("google", { successRedirect: "/api/v2/auth/get-user", failureRedirect: "/api/v2/auth/google/login" })
);



//OTP ROUTES
passportRoutes.post("/verify-otp", validateData(otpValidationSchema), passportController.verifyOtp);
passportRoutes.post("/resend-otp", validateData(resendOtpValidationSchema), passportController.resendOtp);


//LOGOUT ROUTE
passportRoutes.post("/logout", protectRouteMiddlewarePassport, passportController.logout);



passportRoutes.get("/get-user", protectRouteMiddlewarePassport, passportController.userDetails);


export default passportRoutes;
