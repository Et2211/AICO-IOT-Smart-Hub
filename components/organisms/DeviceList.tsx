"use client";

import { type Device } from "@/lib/devices/device.types";
import { DeviceCard } from "@/components/molecules/DeviceCard";
import { Spinner } from "@/components/atoms/Spinner";

interface DeviceListProps {
  devices: Device[];
  loading: boolean;
  onToggle: (id: string, isOn: boolean) => Promise<void>;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export function DeviceList({ devices, loading, onToggle, onEdit, onDelete }: DeviceListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-400">
        <span className="text-5xl">📭</span>
        <p className="text-sm">No devices registered yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
