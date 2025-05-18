import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../../shared/components/response-handler/response-handler';

export const protectRouteMiddlewarePassport = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return ResponseHandler.error({
        res,
        statusCode: 401,
        message: "Unauthorized",
    });
};
