"use client";

import { useState, type FormEvent } from "react";
import { type Device, type DeviceType } from "@/lib/devices/device.types";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { deviceTypeLabels } from "@/styles/variants";

const DEVICE_TYPES: DeviceType[] = ["light", "thermostat", "camera", "lock", "sensor"];

interface FormErrors {
  name?: string;
  location?: string;
  type?: string;
}

interface DeviceFormProps {
  initialValues?: Partial<Device>;
  onSubmit: (data: { name: string; type: DeviceType; location: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function DeviceForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Add Device",
}: DeviceFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [type, setType] = useState<DeviceType>(initialValues?.type ?? "light");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!location.trim()) errs.location = "Location is required";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), type, location: location.trim() });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        id="device-name"
        label="Device Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="e.g. Kitchen Light"
      />

      <div className="flex flex-col gap-1">
        <Label htmlFor="device-type">Device Type</Label>
        <Select
          id="device-type"
          value={type}
          onChange={(e) => setType(e.target.value as DeviceType)}
        >
          {DEVICE_TYPES.map((t) => (
            <option key={t} value={t}>
              {deviceTypeLabels[t]}
            </option>
          ))}
        </Select>
      </div>

      <FormField
        id="device-location"
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={errors.location}
        placeholder="e.g. Living Room"
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
