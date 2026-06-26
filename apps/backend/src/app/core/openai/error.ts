export class OpenAIError extends Error {
  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'OpenAIError';
    this.cause = cause;
  }
}

export class OpenAIOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIOutputError';
  }
}
