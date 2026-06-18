import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`block w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none
        ${error
          ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        } ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
