import { type InputHTMLAttributes, forwardRef } from "react";
import { fieldBase, fieldError } from "@/styles/variants";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`${fieldBase} ${error ? fieldError : ""} ${className}`}
      {...props}
    />
  )
);

Input.displayName = "Input";
