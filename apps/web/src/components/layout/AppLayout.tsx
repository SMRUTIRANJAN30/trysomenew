"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";
import { TOOLS } from "@/lib/toolsData";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = () => setIsCommandPaletteOpen((prev) => !prev);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/") {
      document.title = "trysomenew — One Fast Workspace for Documents, Files & Devices";
      return;
    }
    if (pathname === "/tools") {
      document.title = "Tools Directory — 170+ Document & Productivity Tools | trysomenew";
      return;
    }
    if (pathname === "/beam") {
      document.title = "Beam — Instant Device Pairing & Live Clipboard | trysomenew";
      return;
    }
    if (pathname === "/about") {
      document.title = "About Architect Smrutiranjan Sahoo — trysomenew";
      return;
    }
    const tool = TOOLS.find((t) => t.href === pathname);
    if (tool) {
      document.title = `${tool.name} — Free Online Privacy-First Tool | trysomenew`;
    }
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--pine-tint)] selection:text-[var(--pine)] transition-colors duration-150">
      <Header onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <main className="flex-1 w-full pb-16 sm:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
