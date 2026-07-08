"use client";

import { useState } from "react";
import { type Device } from "@/lib/devices/device.types";
import { Badge } from "@/components/atoms/Badge";
import { StatusDot } from "@/components/atoms/StatusDot";
import { Button } from "@/components/atoms/Button";
import { Toggle } from "@/components/atoms/Toggle";
import { Card } from "@/components/atoms/Card";

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
    try {
      await onToggle(device.id, !device.isOn);
    } finally {
      setToggling(false);
    }
  }

  return (
    <Card>
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
        <Toggle
          checked={device.isOn}
          onChange={handleToggle}
          disabled={toggling || device.status === "offline"}
          ariaLabel={device.isOn ? "Turn off" : "Turn on"}
        />
      </div>

      <div className="flex gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <Button variant="secondary" className="flex-1 text-xs" onClick={() => onEdit(device)}>
          Edit
        </Button>
        <Button variant="danger" className="flex-1 text-xs" onClick={() => onDelete(device)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
