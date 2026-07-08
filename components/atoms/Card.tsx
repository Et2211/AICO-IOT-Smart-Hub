import { type ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {children}
    </div>
  );
}
