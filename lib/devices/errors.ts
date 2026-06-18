export class DeviceNotFoundError extends Error {
  constructor(id: string) {
    super(`Device with id "${id}" not found`);
    this.name = "DeviceNotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}
