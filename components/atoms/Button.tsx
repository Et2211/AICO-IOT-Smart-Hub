"use client";

import { type ButtonHTMLAttributes } from "react";
import { type ActionVariant, actionVariants } from "@/styles/variants";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionVariant;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
