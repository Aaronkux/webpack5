export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'NotFoundError';
  }
}
