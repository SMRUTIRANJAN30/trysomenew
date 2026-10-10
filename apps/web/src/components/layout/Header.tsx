"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Radio,
  User,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { MegaMenu } from "./MegaMenu";
import { Drawer } from "@/components/ui/Drawer";

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const pathname = usePathname();

  useEffect(() => {
    const saved = (localStorage.getItem("trysomenew-theme") as "dark" | "light") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("trysomenew-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[60px] bg-[var(--paper)] border-b border-[var(--line)] transition-colors select-none">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 h-full flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Desktop Mega Menu */}
          <div className="flex items-center gap-6 shrink-0">
            <Logo size="header" />
            <div className="hidden lg:block">
              <MegaMenu />
            </div>
          </div>

          {/* Centre: Search Field (max 480px, input look) */}
          <div className="flex-1 max-w-[480px] mx-2 hidden sm:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full h-10 px-3.5 bg-[var(--surface)] border border-[var(--line)] rounded-[6px] text-sm text-[var(--muted)] flex items-center justify-between hover:border-[var(--pine)] transition-colors cursor-pointer group"
              aria-label="Search tools"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--pine)]" />
                <span>Search 177+ browser tools...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]">
                /
              </kbd>
            </button>
          </div>

          {/* Right: Beam Link, Theme Toggle, Sign In */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenCommandPalette}
              className="sm:hidden p-2 rounded-[6px] text-[var(--ink)] hover:bg-[var(--sunken)]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Beam Signature Link */}
            <Link
              href="/beam"
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-[6px] transition-colors ${
                pathname === "/beam"
                  ? "text-[var(--pine)] bg-[var(--pine-tint)]"
                  : "text-[var(--ink)] hover:bg-[var(--sunken)] hover:text-[var(--pine)]"
              }`}
            >
              <Radio className="w-4 h-4 text-[var(--terracotta)]" />
              <span>Beam</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--sunken)] transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#ECC94B]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--ink)]" />
              )}
            </button>

            {/* Dashboard / Workspace CTA */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-[6px] bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--pine)] text-[var(--ink)] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[var(--pine)]" />
              <span>Dashboard</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-[6px] text-[var(--ink)] hover:bg-[var(--sunken)]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        title="Tools & Navigation"
        position="left"
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-[6px] hover:bg-[var(--sunken)] text-[var(--ink)]"
            >
              Home
            </Link>
            <Link
              href="/tools"
              onClick={() => setMobileDrawerOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-[6px] bg-[var(--pine-tint)] text-[var(--pine)]"
            >
              All 177+ Tools Directory
            </Link>
            <Link
              href="/beam"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-[6px] hover:bg-[var(--sunken)] text-[var(--ink)]"
            >
              <span>Beam Live Sync</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--warning-tint)] text-[var(--warning)]">New</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileDrawerOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-[6px] hover:bg-[var(--sunken)] text-[var(--ink)]"
            >
              Workspace Dashboard
            </Link>
          </div>

          <div className="pt-4 border-t border-[var(--line)] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] px-3">
              Popular Tools
            </div>
            <div className="space-y-1">
              <Link
                href="/pdf/merge"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-1.5 text-xs text-[var(--ink)] hover:text-[var(--pine)]"
              >
                Merge PDF
              </Link>
              <Link
                href="/image/to-pdf"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-1.5 text-xs text-[var(--ink)] hover:text-[var(--pine)]"
              >
                Image to PDF
              </Link>
              <Link
                href="/pdf/compress"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-1.5 text-xs text-[var(--ink)] hover:text-[var(--pine)]"
              >
                Compress PDF
              </Link>
              <Link
                href="/ocr/image"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-1.5 text-xs text-[var(--ink)] hover:text-[var(--pine)]"
              >
                Image OCR
              </Link>
              <Link
                href="/business/invoice"
                onClick={() => setMobileDrawerOpen(false)}
                className="block px-3 py-1.5 text-xs text-[var(--ink)] hover:text-[var(--pine)]"
              >
                Invoice Generator
              </Link>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
