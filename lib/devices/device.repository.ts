import { type Device, type MutableDeviceFields } from "./device.types";

const SEED_DEVICES: Device[] = [
  {
    id: "seed-1",
    name: "Living Room Light",
    type: "light",
    location: "Living Room",
    status: "online",
    isOn: true,
    config: { brightness: 80, colorTemp: 3000 },
    createdAt: new Date("2025-01-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-01T10:00:00Z").toISOString(),
  },
  {
    id: "seed-2",
    name: "Nest Thermostat",
    type: "thermostat",
    location: "Hallway",
    status: "online",
    isOn: true,
    config: { targetTemp: 21, mode: "heat" },
    createdAt: new Date("2025-01-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-01T10:00:00Z").toISOString(),
  },
  {
    id: "seed-3",
    name: "Front Door Camera",
    type: "camera",
    location: "Front Door",
    status: "online",
    isOn: true,
    config: { resolution: "1080p", motionDetection: true },
    createdAt: new Date("2025-01-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-01T10:00:00Z").toISOString(),
  },
  {
    id: "seed-4",
    name: "Garage Lock",
    type: "lock",
    location: "Garage",
    status: "offline",
    isOn: false,
    config: { autoLock: true, autoLockDelay: 30 },
    createdAt: new Date("2025-01-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-01-01T10:00:00Z").toISOString(),
  },
];

let store = new Map<string, Device>(SEED_DEVICES.map((d) => [d.id, d]));

export function _resetForTesting(): void {
  store = new Map(SEED_DEVICES.map((d) => [d.id, d]));
}

export function findAll(): Device[] {
  return Array.from(store.values());
}

export function findById(id: string): Device | undefined {
  return store.get(id);
}

export function insert(device: Device): Device {
  store.set(device.id, device);
  return device;
}

export function patch(id: string, changes: Partial<MutableDeviceFields>): Device | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...changes, id, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return store.delete(id);
}
