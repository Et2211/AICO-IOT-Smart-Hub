import { z } from "zod";

export const DeviceTypeSchema = z.enum([
  "light",
  "thermostat",
  "camera",
  "lock",
  "sensor",
]);
export type DeviceType = z.infer<typeof DeviceTypeSchema>;

export const DeviceStatusSchema = z.enum(["online", "offline"]);
export type DeviceStatus = z.infer<typeof DeviceStatusSchema>;

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: DeviceStatus;
  isOn: boolean;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const CreateDeviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: DeviceTypeSchema,
  location: z.string().min(1, "Location is required").max(100),
  config: z.record(z.string(), z.unknown()).optional().default({}),
});
export type CreateDeviceInput = z.infer<typeof CreateDeviceSchema>;

export const UpdateDeviceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  location: z.string().min(1).max(100).optional(),
  status: DeviceStatusSchema.optional(),
  isOn: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateDeviceInput = z.infer<typeof UpdateDeviceSchema>;
