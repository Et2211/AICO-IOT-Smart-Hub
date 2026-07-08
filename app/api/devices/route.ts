import { listDevices, createDevice } from "@/lib/devices/device.service";
import { toErrorResponse } from "@/lib/devices/errors";

export async function GET(): Promise<Response> {
  return Response.json(listDevices());
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body: unknown = await request.json();
    return Response.json(createDevice(body), { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
