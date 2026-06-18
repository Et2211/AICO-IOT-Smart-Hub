"use client";

import { useState } from "react";
import { type Device } from "@/lib/devices/device.types";
import { Badge } from "@/components/atoms/Badge";
import { StatusDot } from "@/components/atoms/StatusDot";
import { Button } from "@/components/atoms/Button";

const DEVICE_ICONS: Record<string, string> = {
  light: "💡",
  thermostat: "🌡️",
  camera: "📷",
  lock: "🔒",
  sensor: "📡",
};

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string, isOn: boolean) => Promise<void>;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export function DeviceCard({ device, onToggle, onEdit, onDelete }: DeviceCardProps) {
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    setToggling(true);
    await onToggle(device.id, !device.isOn);
    setToggling(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={device.type}>
            {DEVICE_ICONS[device.type]}
          </span>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{device.name}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{device.location}</p>
          </div>
        </div>
        <Badge type={device.type} />
      </div>

      <div className="flex items-center justify-between">
        <StatusDot status={device.status} />
        <button
          onClick={handleToggle}
          disabled={toggling || device.status === "offline"}
          aria-label={device.isOn ? "Turn off" : "Turn on"}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            device.isOn ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-zinc-900 ${
              device.isOn ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <Button variant="secondary" className="flex-1 text-xs" onClick={() => onEdit(device)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1 text-xs" onClick={() => onDelete(device)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
