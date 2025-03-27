export class HttpException extends Error {
  message: string;

  errorCode: any;

  statusCode: number;

  errors: ErrorCode;

  constructor(message: string, errorCode: any, statusCode: any, errors: any) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNPROCESSABLE_ENTITY = 20001,
}

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}