import React from "react";
import { clsx } from "clsx";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={clsx(
        "animate-pulse bg-[var(--sunken)] rounded-[6px]",
        className
      )}
    />
  );
}
