import {
  handleGetOne,
  handleUpdate,
  handleDelete,
} from "@/lib/devices/device.controller";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/devices/[id]">
): Promise<Response> {
  const { id } = await ctx.params;
  return handleGetOne(id);
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/devices/[id]">
): Promise<Response> {
  const { id } = await ctx.params;
  return handleUpdate(id, request);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/devices/[id]">
): Promise<Response> {
  const { id } = await ctx.params;
  return handleDelete(id);
}
