import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "header" | "footer" | "hero" | "sm";
  showWordmark?: boolean;
  className?: string;
}

export function LogoIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="logo-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* 40x40 Rounded Square with Indigo to Purple Gradient */}
      <rect width="40" height="40" rx="10" fill="url(#logo-indigo-grad)" />
      
      {/* Subtle top inner highlight */}
      <rect width="40" height="20" rx="10" fill="url(#logo-shine)" />

      {/* Modern crisp Lightning + Document Tool Symbol in Pure White */}
      <path
        d="M13 10C13 8.89543 13.8954 8 15 8H21.5858C22.1162 8 22.6249 8.21071 22.9999 8.58579L26.4142 12C26.7893 12.3751 27 12.8838 27 13.4142V28C27 29.1046 26.1046 30 25 30H15C13.8954 30 13 29.1046 13 28V10Z"
        fill="white"
        fillOpacity="0.18"
      />
      
      {/* High-speed Lightning Bolt */}
      <path
        d="M21 10L14 20.5H20.5L19 30L26 19.5H19.5L21 10Z"
        fill="white"
        stroke="#4F46E5"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = "header", showWordmark = true, className = "" }: LogoProps) {
  const iconPixel = size === "header" ? 38 : size === "footer" ? 32 : size === "sm" ? 28 : 44;
  const wordmarkClass =
    size === "header"
      ? "text-lg font-bold tracking-tight text-[var(--text-main)]"
      : size === "footer"
      ? "text-base font-bold tracking-tight text-[var(--text-main)]"
      : "text-xl font-extrabold tracking-tight text-[var(--text-main)]";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group transition-transform active:scale-95 ${className}`}>
      <LogoIcon size={iconPixel} className="transition-transform group-hover:scale-105" />
      {showWordmark && (
        <span className={wordmarkClass}>
          try<span className="text-[#4F46E5] dark:text-[#818cf8]">some</span>new
        </span>
      )}
    </Link>
  );
}
