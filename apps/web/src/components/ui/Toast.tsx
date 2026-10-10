import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";

export interface ToastProps {
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type = "success", message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[var(--error)] shrink-0" />,
    info: <Info className="w-4 h-4 text-[var(--info)] shrink-0" />,
  };

  const bgClasses = {
    success: "bg-[var(--surface)] border-[var(--success)]",
    error: "bg-[var(--surface)] border-[var(--error)]",
    info: "bg-[var(--surface)] border-[var(--info)]",
  };

  return (
    <div
      role="alert"
      className={clsx(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[6px] border shadow-[var(--shadow-dropdown)] text-sm font-medium text-[var(--ink)] animate-in slide-in-from-bottom-2 duration-150",
        bgClasses[type]
      )}
    >
      {icons[type]}
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss toast"
        className="ml-2 p-0.5 rounded-[4px] hover:bg-[var(--sunken)] text-[var(--muted)]"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
