export type AppError =
  | { kind: "not_found"; message: string }
  | { kind: "validation"; message: string; fields: Record<string, string[]> };

export function notFound(id: string): AppError {
  return { kind: "not_found", message: `Device with id "${id}" not found` };
}

export function validationError(
  message: string,
  fields: Record<string, string[]>
): AppError {
  return { kind: "validation", message, fields };
}

export function isAppError(err: unknown): err is AppError {
  return typeof err === "object" && err !== null && "kind" in err;
}
