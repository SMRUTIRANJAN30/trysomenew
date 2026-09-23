"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Layers,
  ShieldCheck,
  Send,
  ClipboardCopy,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Read stored theme
    const saved = (localStorage.getItem("trysomenew-theme") as "dark" | "light") || "dark";
    setTheme(saved);
    applyTheme(saved);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", t);
    if (t === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("trysomenew-theme", next);
    applyTheme(next);
  };

  const navLinks = [
    { label: "Tools", href: "/tools" },
    { label: "Merge", href: "/pdf/merge" },
    { label: "Split", href: "/pdf/split" },
    { label: "Rotate", href: "/pdf/rotate" },
    { label: "Compress", href: "/pdf/compress" },
    { label: "To Image", href: "/pdf/to-image" },
    { label: "Verify", href: "/verify", badge: "SHA-256" },
    { label: "Clipboard", href: "/clipboard" },
    { label: "QuickSend", href: "/transfer" },
    { label: "Developer", href: "/about" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? "bg-[var(--header-bg)] backdrop-blur-md border-[var(--border-subtle)] shadow-sm"
          : "bg-[var(--header-translucent)] backdrop-blur-sm border-[var(--border-subtle)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[var(--background)] rounded-[10px] flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4 text-cyan-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)] flex items-center gap-1.5">
              trysomenew
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                PRO
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[var(--muted)]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 font-semibold"
                    : "hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search / Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--muted)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-subtle)] rounded-xl transition-all cursor-pointer group"
            title="Search tools (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-blue-500 transition-colors" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[var(--muted)] border border-[var(--border-subtle)] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle: Bright White vs Deep Dark */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label={theme === "dark" ? "Switch to Bright White mode" : "Switch to Deep Dark mode"}
            title={theme === "dark" ? "Switch to Bright White mode" : "Switch to Deep Dark mode"}
            className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors border border-[var(--border-subtle)] cursor-pointer flex items-center justify-center"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--background)] px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[var(--border-subtle)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg text-sm flex items-center justify-between ${
                  pathname === link.href
                    ? "bg-blue-600/15 text-blue-500 font-semibold"
                    : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1 rounded bg-emerald-500/15 text-emerald-500">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
