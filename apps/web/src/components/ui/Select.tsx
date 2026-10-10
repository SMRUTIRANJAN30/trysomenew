import React, { SelectHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-[var(--muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={clsx(
              "w-full h-10 pl-3 pr-8 py-2 bg-[var(--surface)] text-[var(--ink)] text-base rounded-[6px] border border-[var(--line)] appearance-none focus:border-[var(--pine)] focus:outline-2 focus:outline-[var(--pine)] transition-colors cursor-pointer",
              error && "border-[var(--error)]",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
        </div>
        {error && <p className="text-xs text-[var(--error)] font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
