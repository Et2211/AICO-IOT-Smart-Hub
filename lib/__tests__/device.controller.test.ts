import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../devices/device.service", () => ({
  listDevices: vi.fn(),
  getDevice: vi.fn(),
  createDevice: vi.fn(),
  updateDevice: vi.fn(),
  deleteDevice: vi.fn(),
}));

import { GET as listRoute, POST as createRoute } from "../../app/api/devices/route";
import {
  GET as getRoute,
  PATCH as updateRoute,
  DELETE as deleteRoute,
} from "../../app/api/devices/[id]/route";
import * as service from "../devices/device.service";
import { type Device } from "../devices/device.types";
import { DeviceNotFoundError, ValidationError } from "../devices/errors";

const MOCK_DEVICE: Device = {
  id: "abc-123",
  name: "Test Light",
  type: "light",
  location: "Kitchen",
  status: "online",
  isOn: true,
  config: {},
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

function jsonRequest(body: unknown, method = "POST"): Request {
  return new Request("http://localhost/api/devices", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function malformedRequest(): Request {
  return new Request("http://localhost/api/devices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json",
  });
}

function ctx(id: string): RouteContext<"/api/devices/[id]"> {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("GET /api/devices", () => {
  it("returns 200 with all devices", async () => {
    vi.mocked(service.listDevices).mockReturnValue([MOCK_DEVICE]);
    const res = await listRoute();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([MOCK_DEVICE]);
  });

  it("returns 200 with empty array when no devices", async () => {
    vi.mocked(service.listDevices).mockReturnValue([]);
    const res = await listRoute();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});

describe("POST /api/devices", () => {
  it("returns 201 with the created device", async () => {
    vi.mocked(service.createDevice).mockReturnValue(MOCK_DEVICE);
    const res = await createRoute(jsonRequest({ name: "Test", type: "light", location: "Room" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(MOCK_DEVICE);
  });

  it("returns 422 for validation errors", async () => {
    vi.mocked(service.createDevice).mockImplementation(() => {
      throw new ValidationError("Invalid", { name: ["Required"] });
    });
    const res = await createRoute(jsonRequest({}));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("Invalid");
    expect(body.fields).toEqual({ name: ["Required"] });
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await createRoute(malformedRequest());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/malformed/i);
  });

  it("returns 500 for unexpected errors", async () => {
    vi.mocked(service.createDevice).mockImplementation(() => {
      throw new TypeError("something broke");
    });
    const res = await createRoute(jsonRequest({ name: "Test" }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Internal server error");
  });
});

describe("GET /api/devices/:id", () => {
  it("returns 200 with the device", async () => {
    vi.mocked(service.getDevice).mockReturnValue(MOCK_DEVICE);
    const res = await getRoute(new Request("http://localhost"), ctx("abc-123"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(MOCK_DEVICE);
  });

  it("returns 404 when device not found", async () => {
    vi.mocked(service.getDevice).mockImplementation(() => {
      throw new DeviceNotFoundError("ghost");
    });
    const res = await getRoute(new Request("http://localhost"), ctx("ghost"));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/ghost/);
  });
});

describe("PATCH /api/devices/:id", () => {
  it("returns 200 with the updated device", async () => {
    const updated = { ...MOCK_DEVICE, isOn: false };
    vi.mocked(service.updateDevice).mockReturnValue(updated);
    const res = await updateRoute(jsonRequest({ isOn: false }, "PATCH"), ctx("abc-123"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(updated);
  });

  it("returns 404 when device not found", async () => {
    vi.mocked(service.updateDevice).mockImplementation(() => {
      throw new DeviceNotFoundError("ghost");
    });
    const res = await updateRoute(jsonRequest({ isOn: true }, "PATCH"), ctx("ghost"));
    expect(res.status).toBe(404);
  });

  it("returns 422 for invalid update data", async () => {
    vi.mocked(service.updateDevice).mockImplementation(() => {
      throw new ValidationError("Bad data", { status: ["Invalid"] });
    });
    const res = await updateRoute(jsonRequest({ status: "broken" }, "PATCH"), ctx("abc-123"));
    expect(res.status).toBe(422);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await updateRoute(malformedRequest(), ctx("abc-123"));
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/devices/:id", () => {
  it("returns 204 with no body", async () => {
    vi.mocked(service.deleteDevice).mockReturnValue(undefined);
    const res = await deleteRoute(new Request("http://localhost"), ctx("abc-123"));
    expect(res.status).toBe(204);
    expect(res.body).toBeNull();
  });

  it("returns 404 when device not found", async () => {
    vi.mocked(service.deleteDevice).mockImplementation(() => {
      throw new DeviceNotFoundError("ghost");
    });
    const res = await deleteRoute(new Request("http://localhost"), ctx("ghost"));
    expect(res.status).toBe(404);
  });
});
