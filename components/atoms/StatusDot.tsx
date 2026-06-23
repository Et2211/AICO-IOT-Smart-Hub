import { type DeviceStatus } from "@/lib/devices/device.types";

interface StatusDotProps {
  status: DeviceStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "online" ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      />
      {status === "online" ? "Online" : "Offline"}
    </span>
  );
}
