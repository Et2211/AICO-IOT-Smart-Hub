import { type DeviceType } from "@/lib/devices/device.types";
import { deviceTypeStyles, deviceTypeLabels } from "@/styles/variants";

interface BadgeProps {
  type: DeviceType;
}

export function Badge({ type }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${deviceTypeStyles[type]}`}>
      {deviceTypeLabels[type]}
    </span>
  );
}
