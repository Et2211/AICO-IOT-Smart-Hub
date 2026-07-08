import { getDevice, updateDevice, deleteDevice } from "@/lib/devices/device.service";
import { toErrorResponse } from "@/lib/devices/errors";

type Ctx = RouteContext<"/api/devices/[id]">;

async function id(ctx: Ctx): Promise<string> {
  return (await ctx.params).id;
}

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  try {
    return Response.json(getDevice(await id(ctx)));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  try {
    const body: unknown = await req.json();
    return Response.json(updateDevice(await id(ctx), body));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx): Promise<Response> {
  try {
    deleteDevice(await id(ctx));
    return new Response(null, { status: 204 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
