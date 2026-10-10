import React from "react";
import { clsx } from "clsx";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, id, disabled }: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          "w-11 h-6 rounded-full transition-colors relative focus-visible:outline-2 focus-visible:outline-[var(--pine)] focus-visible:outline-offset-2",
          checked ? "bg-[var(--pine)]" : "bg-[var(--line)]"
        )}
      >
        <span
          className={clsx(
            "w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 shadow-xs",
            checked && "translate-x-5"
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-[var(--ink)]">{label}</span>}
    </label>
  );
}
