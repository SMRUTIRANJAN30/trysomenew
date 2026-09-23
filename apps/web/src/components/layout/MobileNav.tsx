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

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--header-bg)] backdrop-blur-lg border-t border-[var(--border-subtle)] px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
              isActive
                ? "text-blue-500 font-semibold scale-105"
                : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-500" : "text-[var(--muted-text)]"}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
