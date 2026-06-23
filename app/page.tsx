"use client";

import { useState, useEffect } from "react";
import { type Device, type DeviceType } from "@/lib/devices/device.types";
import { DeviceList } from "@/components/organisms/DeviceList";
import { DeviceForm } from "@/components/organisms/DeviceForm";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { Button } from "@/components/atoms/Button";

type Modal =
  | { type: "create" }
  | { type: "edit"; device: Device }
  | { type: "delete"; device: Device }
  | null;

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      if (active) setLoading(true);
      try {
        const res = await fetch("/api/devices");
        if (!res.ok) throw new Error("Failed to load devices");
        const data: Device[] = await res.json();
        if (active) {
          setDevices(data);
          setError(null);
        }
      } catch {
        if (active) setError("Could not load devices. Is the server running?");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function handleCreate(data: { name: string; type: DeviceType; location: string }) {
    const res = await fetch("/api/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create device");
    setModal(null);
    refresh();
  }

  async function handleEdit(data: { name: string; type: DeviceType; location: string }) {
    if (modal?.type !== "edit") return;
    const { name, location } = data;
    const res = await fetch(`/api/devices/${modal.device.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location }),
    });
    if (!res.ok) throw new Error("Failed to update device");
    setModal(null);
    refresh();
  }

  async function handleToggle(id: string, isOn: boolean) {
    const res = await fetch(`/api/devices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOn }),
    });
    if (!res.ok) setError("Failed to toggle device");
    refresh();
  }

  async function handleDelete() {
    if (modal?.type !== "delete") return;
    const res = await fetch(`/api/devices/${modal.device.id}`, { method: "DELETE" });
    if (!res.ok) setError("Failed to delete device");
    setModal(null);
    refresh();
  }

  const onlineCount = devices.filter((d) => d.status === "online").length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              AICO Smart Hub
            </h1>
            {!loading && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {devices.length} device{devices.length !== 1 ? "s" : ""} &middot; {onlineCount} online
              </p>
            )}
          </div>
          <Button onClick={() => setModal({ type: "create" })}>+ Add Device</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : (
          <DeviceList
            devices={devices}
            loading={loading}
            onToggle={handleToggle}
            onEdit={(device) => setModal({ type: "edit", device })}
            onDelete={(device) => setModal({ type: "delete", device })}
          />
        )}
      </main>

      {(modal?.type === "create" || modal?.type === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {modal.type === "create" ? "Add New Device" : "Edit Device"}
            </h2>
            <DeviceForm
              initialValues={modal.type === "edit" ? modal.device : undefined}
              onSubmit={modal.type === "create" ? handleCreate : handleEdit}
              onCancel={() => setModal(null)}
              submitLabel={modal.type === "create" ? "Add Device" : "Save Changes"}
            />
          </div>
        </div>
      )}

      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Delete Device"
          message={`Are you sure you want to delete "${modal.device.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
