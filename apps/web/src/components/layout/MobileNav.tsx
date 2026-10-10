"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, Radio, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Tools", href: "/tools", icon: Grid },
    { label: "Search", href: "#search", icon: Search, isAction: true },
    { label: "Beam", href: "/beam", icon: Radio },
    { label: "Dashboard", href: "/dashboard", icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--line)] px-2 py-1 flex items-center justify-around select-none shadow-[0_-2px_10px_rgba(0,0,0,0.04)] pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isAction) {
          return (
            <button
              key={item.label}
              onClick={handleSearchClick}
              className="flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--pine)] transition-colors"
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors ${
              isActive
                ? "text-[var(--pine)] font-semibold"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-[var(--pine)]" : ""}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
