import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full py-10 px-6 bg-[var(--surface)] border border-[var(--error)]/40 rounded-[8px] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-[6px] bg-[var(--error-tint)] flex items-center justify-center text-[var(--error)] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[var(--ink)] mb-1">{title}</h4>
      <p className="text-sm text-[var(--muted)] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary text-sm h-9 px-4 flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
