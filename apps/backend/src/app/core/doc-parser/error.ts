export class InvalidFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFileError';
  }
}

export class ParserError extends Error {
  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'ParserError';
    this.cause = cause;
  }
}
