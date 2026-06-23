import { type SelectHTMLAttributes, forwardRef } from "react";
import { fieldBase } from "@/styles/variants";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...props }, ref) => (
    <select ref={ref} className={`${fieldBase} ${className}`} {...props}>
      {children}
    </select>
  )
);

Select.displayName = "Select";
