import React, { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-[var(--muted)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "w-full h-10 px-3 py-2 bg-[var(--surface)] text-[var(--ink)] text-base rounded-[6px] border border-[var(--line)] placeholder:text-[var(--muted)]/60 focus:border-[var(--pine)] focus:outline-2 focus:outline-[var(--pine)] transition-colors disabled:opacity-50",
            error && "border-[var(--error)] focus:border-[var(--error)] focus:outline-[var(--error)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)] font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
