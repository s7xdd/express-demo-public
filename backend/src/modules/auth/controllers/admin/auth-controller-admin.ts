
import { Response, NextFunction } from "express";

import { ResponseHandler } from "../../../../shared/components/response-handler/response-handler";
import { createPayload, handleUserExistence } from "../../../../shared/utils/helper/common-functions";
import { checkPermissionBlock, comparePasswords } from "../../functions/auth-functions";
import { PERMISSION_BLOCKS } from "../../constants/admin/auth-constants";
import { generateJwt } from "../../functions/jwt-functions";

export const adminAuthController = {

    async loginUser(req: any, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            const { user }: { user: any } = await handleUserExistence({ username: username, throwNoUserExistsError: true });

            const isPasswordValid = await comparePasswords({
                plainPassword: password,
                hashedPassword: user.password,
            });

            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }

            if (checkPermissionBlock({ userDetails: user, requiredPermission: PERMISSION_BLOCKS.admin })) {
                const token = generateJwt(user)

                const userPayload = createPayload(user, ["_id", "username", "email", "bio", "is_admin", "avatar_url", "date_registered"]);

                ResponseHandler.success({
                    res,
                    statusCode: 200,
                    data: { ...userPayload, token: token },
                    message: "Login successful",
                });

            } else {
                throw new Error("Unauthorized");

            }

        } catch (error) {
            next(error);
        }
    },
};
