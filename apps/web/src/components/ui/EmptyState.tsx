import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="w-full py-12 px-6 bg-[var(--surface)] border border-[var(--line)] rounded-[8px] flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-[6px] bg-[var(--sunken)] flex items-center justify-center text-[var(--muted)] mb-3">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-[var(--ink)] mb-1">{title}</h4>
      <p className="text-sm text-[var(--muted)] max-w-sm mb-4">{description}</p>
      {actionText && actionHref && (
        <Link href={actionHref} className="btn-pine text-sm h-9 px-4">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionHref && (
        <button onClick={onAction} className="btn-pine text-sm h-9 px-4">
          {actionText}
        </button>
      )}
    </div>
  );
}
