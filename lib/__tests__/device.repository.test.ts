import { describe, it, expect } from "vitest";
import { type Device } from "../devices/device.types";
import { findAll, findById, insert, patch, remove } from "../devices/device.repository";

describe("seed data", () => {
  it("starts with 4 pre-seeded devices", () => {
    expect(findAll()).toHaveLength(4);
  });

  it("includes a device with id seed-1", () => {
    const device = findById("seed-1");
    expect(device).toBeDefined();
    expect(device!.name).toBe("Living Room Light");
  });
});

describe("findById", () => {
  it("returns undefined for a non-existent id", () => {
    expect(findById("no-such-id")).toBeUndefined();
  });
});

describe("insert", () => {
  it("adds a device and makes it retrievable", () => {
    const device: Device = {
      id: "test-insert",
      name: "Test Device",
      type: "sensor",
      location: "Lab",
      status: "offline",
      isOn: false,
      config: {},
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    const result = insert(device);
    expect(result).toEqual(device);
    expect(findById("test-insert")).toEqual(device);
  });
});

describe("patch", () => {
  it("merges changes into the existing device", () => {
    const updated = patch("seed-1", { isOn: false });
    expect(updated).toBeDefined();
    expect(updated!.isOn).toBe(false);
    expect(updated!.name).toBe("Living Room Light");
  });

  it("updates the updatedAt timestamp", () => {
    const before = findById("seed-2")!.updatedAt;
    const updated = patch("seed-2", { isOn: false });
    expect(updated!.updatedAt).not.toBe(before);
  });

  it("returns undefined for a non-existent id", () => {
    expect(patch("ghost", { isOn: true })).toBeUndefined();
  });
});

describe("remove", () => {
  it("returns true and removes the device", () => {
    expect(remove("seed-4")).toBe(true);
    expect(findById("seed-4")).toBeUndefined();
  });

  it("returns false for a non-existent id", () => {
    expect(remove("ghost")).toBe(false);
  });
});
