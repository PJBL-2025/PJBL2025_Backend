import { HttpException } from '../exceptions/http.exception';
import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(error.statusCode).json({
      message: error.message || 'Internal Server Error',
      errorCode: error.errorCode || null,
      errors: error.errors || null,
    });
  } catch (e) {
    next(e);
  }
};