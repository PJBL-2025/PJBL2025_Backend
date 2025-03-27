import { HttpException } from '../exceptions/http.exception';
import { Request, Response } from 'express';

export const errorMiddleware = (error: HttpException, req: Request, res: Response) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
};