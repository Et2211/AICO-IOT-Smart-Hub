import { type ReactNode } from "react";

interface AppHeaderProps {
  subtitle?: string;
  action?: ReactNode;
}

export function AppHeader({ subtitle, action }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1>AICO Smart Hub</h1>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
