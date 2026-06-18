import { type DeviceType } from "@/lib/devices/device.types";

const TYPE_STYLES: Record<DeviceType, string> = {
  light: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  thermostat: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  camera: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  lock: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  sensor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const TYPE_LABELS: Record<DeviceType, string> = {
  light: "Light",
  thermostat: "Thermostat",
  camera: "Camera",
  lock: "Lock",
  sensor: "Sensor",
};

interface BadgeProps {
  type: DeviceType;
}

export function Badge({ type }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[type]}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}
