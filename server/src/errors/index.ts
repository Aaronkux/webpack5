export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'ValidationError';
  }
}

export class MyError extends Error {
  constructor(message, name) {
    super(message);
    this.message = message;
    this.name = name;
  }
}
