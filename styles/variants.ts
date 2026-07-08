import { type DeviceStatus, type DeviceType } from "@/lib/devices/device.types";

export type ActionVariant = "primary" | "secondary" | "danger";

export const actionVariants: Record<ActionVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
  secondary:
    "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const deviceTypeStyles: Record<DeviceType, string> = {
  light: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  thermostat: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  camera: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  lock: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  sensor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export const deviceTypeLabels: Record<DeviceType, string> = {
  light: "Light",
  thermostat: "Thermostat",
  camera: "Camera",
  lock: "Lock",
  sensor: "Sensor",
};

export const statusDotStyles: Record<DeviceStatus, string> = {
  online: "bg-green-500",
  offline: "bg-zinc-300 dark:bg-zinc-600",
};

export const dialogBase =
  "w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900";

export const fieldBase =
  "block w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 outline-none transition-colors border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-500";

export const fieldError =
  "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500";
