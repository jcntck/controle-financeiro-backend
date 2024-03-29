export default class ValidationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
