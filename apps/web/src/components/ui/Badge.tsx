import React from "react";
import { clsx } from "clsx";

export interface BadgeProps {
  variant?: "new" | "popular" | "pine" | "muted" | "pdf" | "image" | "video" | "text" | "converters" | "developer";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "muted", children, className }: BadgeProps) {
  const variantStyles = {
    new: "bg-[var(--success-tint)] text-[var(--success)] border-transparent",
    popular: "bg-[var(--warning-tint)] text-[var(--warning)] border-transparent",
    pine: "bg-[var(--pine-tint)] text-[var(--pine)] border-transparent",
    muted: "bg-[var(--sunken)] text-[var(--muted)] border-[var(--line)]",
    pdf: "bg-[var(--cat-pdf)] text-[#8A2810] border-transparent",
    image: "bg-[var(--cat-image)] text-[#1F5F4A] border-transparent",
    video: "bg-[var(--cat-video)] text-[#4A3563] border-transparent",
    text: "bg-[var(--cat-text)] text-[#1A4363] border-transparent",
    converters: "bg-[var(--cat-converters)] text-[#755217] border-transparent",
    developer: "bg-[var(--cat-developer)] text-[#333A36] border-transparent",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-[4px] border select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
