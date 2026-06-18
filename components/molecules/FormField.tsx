import { type InputHTMLAttributes, forwardRef } from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input ref={ref} id={id} error={error} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);

FormField.displayName = "FormField";
