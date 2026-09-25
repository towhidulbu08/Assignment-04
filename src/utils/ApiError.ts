// Custom error class so we can attach an HTTP status code to any thrown error.
// Usage: throw new ApiError(404, "Gear not found");
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
