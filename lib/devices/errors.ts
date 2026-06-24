export class DeviceNotFoundError extends Error {
  readonly kind = "not_found" as const;

  constructor(id: string) {
    super(`Device with id "${id}" not found`);
    this.name = "DeviceNotFoundError";
  }
}

export class ValidationError extends Error {
  readonly kind = "validation" as const;
  readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export type AppError = DeviceNotFoundError | ValidationError;

export function isAppError(err: unknown): err is AppError {
  return err instanceof DeviceNotFoundError || err instanceof ValidationError;
}
