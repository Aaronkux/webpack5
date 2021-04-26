export class MyError extends Error {
  constructor(message, name) {
    super(message);
    this.message = message;
    this.name = name;
  }
}
