import { ZodError } from "zod";
import { formatValidationErrors } from "../utils/helper/common-functions";
import { ResponseHandler } from "../components/response-handler/response-handler";

export const validateData = (schema: any) => (req: any, res: any, next: any) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: ZodError | any) {
    ResponseHandler.error({
      res,
      message: "Validation Error",
      error: formatValidationErrors(error?.issues),
    });
  }
};
