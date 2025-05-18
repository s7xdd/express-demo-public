import { NextFunction } from "express";
import path from "path";

import { ResponseHandler } from "../../../shared/components/response-handler/response-handler";

export const socketIoController = {
    async getHandlder(req: any, res: any, next: NextFunction) {
        // ResponseHandler.sendFile({
        //     res,
        //     filePath: path.join(__dirname, '..', 'html', 'index.ejs')
        // })
        res.render(path.join(__dirname, '..', 'html', 'index.ejs'))
    }
};
