import adminAuthRoutes from "./routes/admin/auth-routes-admin";
import frontendAuthRoutes from "./routes/frontend/auth-routes-frontend";
import { userService } from "./services/user/user-service";
import { protectedRouteMiddleware } from "./middleware/common/protected-route-middleware";
import { permissionMiddleware } from "./middleware/common/permission-middleware-admin";
import { otpServices } from "./services/otp/otp-services";
import { protectRouteMiddlewarePassport } from "./middleware/common/protected-route-middlware-passport";
import passportRoutes from "./routes/frontend/passport-routes-frontend";

export const authModule = {

    routes: {
        admin: adminAuthRoutes,
        v1: frontendAuthRoutes,
        v2: passportRoutes
    },

    services: {
        user: userService,
        otp: otpServices,
    },

    middlewares: {
        protectedroute: protectedRouteMiddleware,
        protectedroute_passport: protectRouteMiddlewarePassport,
        permission: permissionMiddleware
    },

};