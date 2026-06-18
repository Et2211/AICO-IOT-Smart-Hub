import { handleList, handleCreate } from "@/lib/devices/device.controller";

export async function GET(): Promise<Response> {
  return handleList();
}

export async function POST(request: Request): Promise<Response> {
  return handleCreate(request);
}
