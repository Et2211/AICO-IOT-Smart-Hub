import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeviceNotFoundError, ValidationError } from "../devices/errors";

vi.mock("../devices/device.repository", () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  insert: vi.fn(),
  patch: vi.fn(),
  remove: vi.fn(),
}));

import * as repo from "../devices/device.repository";
import {
  listDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../devices/device.service";
import { type Device } from "../devices/device.types";

const MOCK_DEVICE: Device = {
  id: "abc-123",
  name: "Test Light",
  type: "light",
  location: "Kitchen",
  status: "online",
  isOn: true,
  config: {},
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("listDevices", () => {
  it("returns all devices from the repository", () => {
    vi.mocked(repo.findAll).mockReturnValue([MOCK_DEVICE]);
    expect(listDevices()).toEqual([MOCK_DEVICE]);
  });
});

describe("getDevice", () => {
  it("returns the device when found", () => {
    vi.mocked(repo.findById).mockReturnValue(MOCK_DEVICE);
    expect(getDevice("abc-123")).toEqual(MOCK_DEVICE);
  });

  it("throws DeviceNotFoundError when not found", () => {
    vi.mocked(repo.findById).mockReturnValue(undefined);
    expect(() => getDevice("ghost")).toThrow(DeviceNotFoundError);
  });
});

describe("createDevice", () => {
  it("inserts and returns a new device with defaults", () => {
    vi.mocked(repo.insert).mockImplementation((d) => d);
    const device = createDevice({ name: "Sensor", type: "sensor", location: "Attic" });
    expect(device.status).toBe("offline");
    expect(device.isOn).toBe(false);
    expect(device.id).toBeTruthy();
    expect(repo.insert).toHaveBeenCalledOnce();
  });

  it("throws ValidationError for missing name", () => {
    expect(() => createDevice({ type: "light", location: "Hall" })).toThrow(ValidationError);
  });

  it("throws ValidationError for invalid device type", () => {
    expect(() =>
      createDevice({ name: "Oven", type: "microwave", location: "Kitchen" })
    ).toThrow(ValidationError);
  });

  it("includes field-level errors on ValidationError", () => {
    expect.assertions(2);
    try {
      createDevice({});
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      if (err instanceof ValidationError) {
        expect(err.fields).toHaveProperty("name");
      }
    }
  });
});

describe("updateDevice", () => {
  it("patches and returns the updated device", () => {
    vi.mocked(repo.findById).mockReturnValue(MOCK_DEVICE);
    vi.mocked(repo.patch).mockReturnValue({ ...MOCK_DEVICE, isOn: false });
    const result = updateDevice("abc-123", { isOn: false });
    expect(result.isOn).toBe(false);
  });

  it("does not pass undefined values through to the repository", () => {
    vi.mocked(repo.findById).mockReturnValue(MOCK_DEVICE);
    vi.mocked(repo.patch).mockReturnValue(MOCK_DEVICE);
    updateDevice("abc-123", { name: undefined, isOn: true });
    const patchArg = vi.mocked(repo.patch).mock.calls[0][1];
    expect(patchArg).not.toHaveProperty("name");
    expect(patchArg).toHaveProperty("isOn", true);
  });

  it("throws DeviceNotFoundError when device does not exist", () => {
    vi.mocked(repo.findById).mockReturnValue(undefined);
    expect(() => updateDevice("ghost", { isOn: true })).toThrow(DeviceNotFoundError);
  });

  it("throws ValidationError for invalid status value", () => {
    vi.mocked(repo.findById).mockReturnValue(MOCK_DEVICE);
    expect(() => updateDevice("abc-123", { status: "broken" })).toThrow(ValidationError);
  });
});

describe("deleteDevice", () => {
  it("removes the device successfully", () => {
    vi.mocked(repo.remove).mockReturnValue(true);
    expect(() => deleteDevice("abc-123")).not.toThrow();
  });

  it("throws DeviceNotFoundError when device does not exist", () => {
    vi.mocked(repo.remove).mockReturnValue(false);
    expect(() => deleteDevice("ghost")).toThrow(DeviceNotFoundError);
  });
});
