import { type DeviceStatus } from "@/lib/devices/device.types";
import { statusDotStyles } from "@/styles/variants";

interface StatusDotProps {
  status: DeviceStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
      <span className={`h-2 w-2 rounded-full ${statusDotStyles[status]}`} />
      {status === "online" ? "Online" : "Offline"}
    </span>
  );
}
