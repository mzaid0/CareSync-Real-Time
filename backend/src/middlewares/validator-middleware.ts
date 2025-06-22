import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        res.status(400).json({ message: messages[0] });
      } else {
        next(error);
      }
    }
  };
