"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { dialogBase } from "@/styles/variants";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className={`${dialogBase} max-w-sm`}
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
