"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";

// The palette (and the full search index it needs) is only downloaded when first opened.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsCommandPaletteOpen((prev) => !prev);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  // Open shortcuts while the palette isn't mounted yet (once open, the palette handles keys itself).
  useEffect(() => {
    if (isCommandPaletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCommandPaletteOpen]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--pine-tint)] selection:text-[var(--pine)] transition-colors duration-150">
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <main className="flex-1 w-full pb-16 sm:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      {isCommandPaletteOpen && (
        <CommandPalette isOpen onClose={() => setIsCommandPaletteOpen(false)} />
      )}
    </div>
  );
}
