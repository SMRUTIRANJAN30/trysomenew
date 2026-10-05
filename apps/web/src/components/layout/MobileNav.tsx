"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShieldCheck, Send, ClipboardCopy } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Tools", href: "/tools", icon: Grid },
    { label: "Verify", href: "/verify", icon: ShieldCheck },
    { label: "Clipboard", href: "/clipboard", icon: ClipboardCopy },
    { label: "Transfer", href: "/transfer", icon: Send },
  ];

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--header-bg)] backdrop-blur-lg border-t border-[var(--border-card)] px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
          pathname === "/" ? "text-[#4F46E5] font-bold scale-105" : "text-[var(--text-muted)]"
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 ${pathname === "/" ? "text-[#4F46E5]" : ""}`} />
        <span>Home</span>
      </Link>

      <Link
        href="/tools"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
          pathname === "/tools" ? "text-[#4F46E5] font-bold scale-105" : "text-[var(--text-muted)]"
        }`}
      >
        <Grid className={`w-5 h-5 mb-0.5 ${pathname === "/tools" ? "text-[#4F46E5]" : ""}`} />
        <span>Tools</span>
      </Link>

      <button
        onClick={handleSearchClick}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-[var(--text-muted)] hover:text-[#4F46E5] transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center -mt-3 shadow-md shadow-indigo-500/30">
          <span className="text-xs font-bold">/</span>
        </div>
        <span>Search</span>
      </button>

      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
          pathname === "/dashboard" ? "text-[#4F46E5] font-bold scale-105" : "text-[var(--text-muted)]"
        }`}
      >
        <ClipboardCopy className={`w-5 h-5 mb-0.5 ${pathname === "/dashboard" ? "text-[#4F46E5]" : ""}`} />
        <span>Workspace</span>
      </Link>

      <Link
        href="/verify"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
          pathname === "/verify" ? "text-[#4F46E5] font-bold scale-105" : "text-[var(--text-muted)]"
        }`}
      >
        <ShieldCheck className={`w-5 h-5 mb-0.5 ${pathname === "/verify" ? "text-[#4F46E5]" : ""}`} />
        <span>Verify</span>
      </Link>
    </nav>
  );
}
