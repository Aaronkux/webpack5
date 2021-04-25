import { ValidationError } from '../errors';

export function parseIntOrThrowValidationError(
  input: string,
  errorMsg: string
) {
  const validId = parseInt(input);
  if (isNaN(validId)) {
    throw new ValidationError(errorMsg);
  }
  return validId;
}
