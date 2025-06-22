import { Request, Response, NextFunction } from "express";
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${error.message}`, { stack: error.stack });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (error.name === "ZodError") {
    res.status(400).json({
      message: "Validation error",
      error: error,
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
    error: error.message,
  });
};
