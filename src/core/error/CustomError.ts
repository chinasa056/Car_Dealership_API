export class CustomError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;

  constructor(message: string, errorCode: string, statusCode: number = 500) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, CustomError.prototype);
  };
};
