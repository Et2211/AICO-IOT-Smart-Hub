import {
  listDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from "./device.service";
import { isAppError } from "./errors";

export async function handleList(): Promise<Response> {
  const devices = listDevices();
  return Response.json(devices);
}

export async function handleCreate(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const device = createDevice(body);
    return Response.json(device, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function handleGetOne(id: string): Promise<Response> {
  try {
    const device = getDevice(id);
    return Response.json(device);
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function handleUpdate(id: string, request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const device = updateDevice(id, body);
    return Response.json(device);
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function handleDelete(id: string): Promise<Response> {
  try {
    deleteDevice(id);
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

function toErrorResponse(err: unknown): Response {
  if (err instanceof SyntaxError) {
    return Response.json({ error: "Malformed JSON in request body" }, { status: 400 });
  }
  if (!isAppError(err)) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
  if (err.kind === "not_found") {
    return Response.json({ error: err.message }, { status: 404 });
  }
  return Response.json({ error: err.message, fields: err.fields }, { status: 422 });
}
