import { type SelectHTMLAttributes, forwardRef } from "react";
import { fieldBase } from "@/styles/variants";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select ref={ref} className={`${fieldBase} disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </select>
  )
);

Select.displayName = "Select";
