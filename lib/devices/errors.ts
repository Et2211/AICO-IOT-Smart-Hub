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

export function toErrorResponse(err: unknown): Response {
  if (err instanceof SyntaxError) {
    return Response.json({ error: "Malformed JSON in request body" }, { status: 400 });
  }
  if (err instanceof DeviceNotFoundError) {
    return Response.json({ error: err.message }, { status: 404 });
  }
  if (err instanceof ValidationError) {
    return Response.json({ error: err.message, fields: err.fields }, { status: 422 });
  }
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
