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
  Sparkles,
  User,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { MegaMenu } from "./MegaMenu";

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

function applyTheme(t: "dark" | "light") {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
  if (t === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }
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

    const saved = (localStorage.getItem("trysomenew-theme") as "dark" | "light") || "dark";
    setTheme(saved);
    applyTheme(saved);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("trysomenew-theme", next);
    applyTheme(next);
  };

  const navLinks = [
    { label: "PDF Tools", href: "/pdf/merge" },
    { label: "Image Tools", href: "/image/to-pdf" },
    { label: "Video Tools", href: "/misc/screen-record" },
    { label: "Roadmap", href: "/roadmap", badge: "Phase 3" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full h-16 transition-all duration-200 border-b ${
          isScrolled
            ? "bg-[var(--header-bg)] backdrop-blur-md border-[var(--border-card)] shadow-sm"
            : "bg-[var(--header-bg)] backdrop-blur-sm border-[var(--border-card)]"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Logo size="header" />
          </div>

          {/* Centre: MegaMenu + Direct Category Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[var(--text-main)]">
            <MegaMenu />
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl transition-colors relative flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#4F46E5] bg-[#4F46E5]/10 font-bold"
                      : "hover:text-[#4F46E5] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Theme Toggle, Sign In */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 h-10 px-3 sm:px-4 rounded-xl bg-[var(--bg-section)] hover:bg-black/5 dark:hover:bg-white/10 border border-[var(--border-card)] text-xs text-[var(--text-muted)] transition-all cursor-pointer shadow-xs group"
              title="Search tools (Press / or Ctrl+K)"
            >
              <Search className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#4F46E5] transition-colors" />
              <span className="hidden sm:inline font-medium">Search 177+ tools...</span>
              <kbd className="hidden md:inline-flex items-center justify-center h-5 px-1.5 rounded bg-black/5 dark:bg-white/10 border border-[var(--border-card)] font-mono text-[10px] text-[var(--text-main)]">
                /
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-[var(--border-card)] transition-colors"
              aria-label="Toggle dark/light mode"
            >
              {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {/* Sign In CTA */}
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-sm active:scale-95"
            >
              <User size={14} />
              <span>Workspace</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl lg:hidden text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border-card)] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[var(--bg-main)] animate-in fade-in duration-200 flex flex-col">
          {/* Mobile Header Bar */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-card)]">
            <Logo size="header" />
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-[var(--text-muted)]"
              >
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Always-visible search in mobile drawer */}
          <div className="p-4 border-b border-[var(--border-card)]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette?.();
              }}
              className="w-full flex items-center gap-3 h-12 px-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)] text-sm text-[var(--text-muted)] font-medium"
            >
              <Search className="w-5 h-5 text-[#4F46E5]" />
              <span>Search 177+ tools...</span>
            </button>
          </div>

          {/* Mobile Nav Links List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 py-2">
              Popular Tools
            </div>
            <Link
              href="/pdf/merge"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Merge PDF</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">PDF</span>
            </Link>
            <Link
              href="/image/to-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Image to PDF</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">Image</span>
            </Link>
            <Link
              href="/ocr/image"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Image OCR (WASM)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500">WASM</span>
            </Link>
            <Link
              href="/ai/summarize"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Document Summarizer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">AI</span>
            </Link>
            <Link
              href="/business/invoice"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Invoice Generator</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">Business</span>
            </Link>
            <Link
              href="/pdf/redact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
            >
              <span>Redact PDF</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">Security</span>
            </Link>

            <div className="pt-4 border-t border-[var(--border-card)] space-y-1">
              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] font-bold"
              >
                <span>Browse All 177+ Tools</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
              >
                <span>Workspace Dashboard</span>
              </Link>
              <Link
                href="/roadmap"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-section)] font-medium text-[var(--text-main)]"
              >
                <span>Roadmap & Phase 3</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
