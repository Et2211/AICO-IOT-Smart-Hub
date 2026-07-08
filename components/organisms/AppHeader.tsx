import { type ReactNode } from "react";

export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          AICO Smart Hub
        </h1>
        {children}
      </div>
    </header>
  );
}
