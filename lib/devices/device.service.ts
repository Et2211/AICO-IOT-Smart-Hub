import { type ZodError } from "zod";
import * as repo from "./device.repository";
import {
  type Device,
  type CreateDeviceInput,
  CreateDeviceSchema,
  UpdateDeviceSchema,
} from "./device.types";
import { DeviceNotFoundError, ValidationError } from "./errors";

export function listDevices(): Device[] {
  return repo.findAll();
}

export function getDevice(id: string): Device {
  const device = repo.findById(id);
  if (!device) throw new DeviceNotFoundError(id);
  return device;
}

export function createDevice(input: unknown): Device {
  const result = CreateDeviceSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid device data", formatZodErrors(result.error));
  }
  const data: CreateDeviceInput = result.data;
  const now = new Date().toISOString();
  const device: Device = {
    id: crypto.randomUUID(),
    name: data.name,
    type: data.type,
    location: data.location,
    status: "offline",
    isOn: false,
    config: data.config,
    createdAt: now,
    updatedAt: now,
  };
  return repo.insert(device);
}

export function updateDevice(id: string, input: unknown): Device {
  getDevice(id); // throws DeviceNotFoundError if missing
  const result = UpdateDeviceSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError("Invalid update data", formatZodErrors(result.error));
  }
  const data = stripUndefined(result.data);
  const updated = repo.patch(id, data);
  if (!updated) throw new DeviceNotFoundError(id);
  return updated;
}

export function deleteDevice(id: string): void {
  const deleted = repo.remove(id);
  if (!deleted) throw new DeviceNotFoundError(id);
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = issue.path.join(".") || "_root";
    acc[key] = [...(acc[key] ?? []), issue.message];
    return acc;
  }, {});
}
