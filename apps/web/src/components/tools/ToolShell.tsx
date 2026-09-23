"use client";
import { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

interface ToolShellProps {
  title: string;
  description: string;
  isLocal?: boolean;
  children: ReactNode;
  actions?: ReactNode;
}

export default function ToolShell({ title, description, isLocal = true, children, actions }: ToolShellProps) {
  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2 tracking-tight">{title}</h1>
              <p className="text-sm text-[var(--muted)]">{description}</p>
            </div>
            {isLocal && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full whitespace-nowrap font-medium">
                <ShieldCheck size={13} />
                100% Local — never leaves your device
              </span>
            )}
          </div>
          {actions && <div className="mt-4 flex gap-2 flex-wrap">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
