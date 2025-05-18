import { Response } from "express";

interface BaseResponseOptions {
  res: Response;
  statusCode?: number;
  message?: string;
  props?: Record<string, any>;
}

interface SuccessOptions extends BaseResponseOptions {
  data?: any;
  totalCount?: any;
}

interface ErrorOptions extends BaseResponseOptions {
  error?: any;
}

interface SendFileOptions extends BaseResponseOptions {
  filePath: string;
  fileName?: string;
  contentType?: string;
}

export const ResponseHandler = {
  success: ({
    res,
    statusCode = 200,
    message = "Success",
    data = null,
    totalCount = null,
    props = {},
  }: SuccessOptions) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      totalCount,
      ...props,
    });
  },

  error: ({ res, statusCode = 500, message = "Something went wrong", error = null, props = {} }: ErrorOptions) => {
    res.status(statusCode).json({
      success: false,
      message,
      error,
      ...props,
    });
  },

  sendFile: ({
    res,
    filePath,
    fileName,
    contentType,
    statusCode = 200,
    message = "File sent successfully",
  }: SendFileOptions) => {
    res.status(statusCode).sendFile(
      filePath,
      // (err) => {
      //   if (err) {
      //     console.error(err);
      //     res.status(500).json({
      //       success: false,
      //       message: "Error sending file",
      //     });
      //   } else {
      //     res.status(statusCode).json({
      //       success: true,
      //       message,
      //     });
      //   }
      // }
    );
  },
};

