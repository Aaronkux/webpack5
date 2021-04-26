import { MyError } from '../errors';

export function parseIntOrThrowValidationError(
  input: string,
  errorMsg: string
) {
  const validId = parseInt(input);
  if (isNaN(validId)) {
    throw new MyError(errorMsg, 'ValidationError');
  }
  return validId;
}
