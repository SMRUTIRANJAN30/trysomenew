import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-5 transition-colors",
        hoverable && "hover:border-[var(--pine)] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
