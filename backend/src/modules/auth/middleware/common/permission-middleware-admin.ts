import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";
import { checkPermissionBlock } from "../../functions/auth-functions";

export const permissionMiddleware = ({ requiredPermission }: { requiredPermission: string }) => (req: any, res: any, next: any) => {
    const userDetails = req.userDetails;
    if (checkPermissionBlock({ userDetails, requiredPermission })) {
        next();
    } else {
        return ResponseHandler.error({
            res,
            message: "Unauthorized",
            statusCode: 403,

        })
    }
};

