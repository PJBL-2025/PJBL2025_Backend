import { HttpException } from './http.exception';

export class UnprocessableEntry extends HttpException {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error);
  }
}