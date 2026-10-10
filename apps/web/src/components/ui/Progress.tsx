import React from "react";
import { clsx } from "clsx";

export interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  className?: string;
}

export function Progress({ value, label, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx("w-full space-y-1.5", className)}>
      {label && (
        <div className="flex justify-between text-xs font-semibold text-[var(--muted)]">
          <span>{label}</span>
          <span className="font-mono">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2 bg-[var(--sunken)] rounded-full overflow-hidden border border-[var(--line)]/50"
      >
        <div
          className="h-full bg-[var(--pine)] transition-all duration-200"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
