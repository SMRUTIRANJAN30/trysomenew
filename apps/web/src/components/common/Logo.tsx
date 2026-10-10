import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { clsx } from "clsx";

export interface LogoProps {
  size?: "header" | "footer" | "hero";
  className?: string;
}

export function Logo({ size = "header", className }: LogoProps) {
  const iconSizes = {
    header: "w-8 h-8", // 32x32px
    footer: "w-7 h-7", // 28x28px
    hero: "w-10 h-10",
  };

  const textSizes = {
    header: "text-lg",
    footer: "text-base",
    hero: "text-2xl",
  };

  return (
    <Link
      href="/"
      aria-label="trysomenew homepage"
      className={clsx(
        "inline-flex items-center gap-2.5 select-none hover:no-underline group",
        className
      )}
    >
      {/* 32x32 Pine rounded square with 6px radius + white spanner glyph */}
      <div
        className={clsx(
          "rounded-[6px] bg-[var(--pine)] flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105",
          iconSizes[size]
        )}
      >
        <Wrench className="w-4 h-4 text-white stroke-[2]" />
      </div>

      <span
        className={clsx(
          "font-heading font-semibold text-[var(--ink)] tracking-tight",
          textSizes[size]
        )}
      >
        trysomenew
      </span>
    </Link>
  );
}
