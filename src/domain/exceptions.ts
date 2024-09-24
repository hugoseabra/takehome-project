export class ValidationError extends Error {
  constructor(protected alias: string, message: string) {
    super(message)
  }
}
