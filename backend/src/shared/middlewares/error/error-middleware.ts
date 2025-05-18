import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../components/response-handler/response-handler";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  return ResponseHandler.error({
    res,
    statusCode,
    message,
    ...{ stack: err.stack },
  });
};
