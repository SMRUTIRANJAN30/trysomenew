"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--footer-bg)] border-t border-[var(--border-card)] text-[var(--text-muted)] text-sm mt-20 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Logo size="footer" />
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              The AI-native, all-in-one document workspace designed to compete with legacy tools. 177+ tools running locally in your browser memory.
            </p>

            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero-Storage Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                <Lock size={12} className="text-[#4F46E5]" />
                <span>256-Bit SSL Client Encryption</span>
              </div>
            </div>
          </div>

          {/* Column 2: PDF Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf/merge" className="hover:text-[#4F46E5] transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/split" className="hover:text-[#4F46E5] transition-colors">
                  Split & Extract Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/compress" className="hover:text-[#4F46E5] transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/redact" className="hover:text-[#4F46E5] transition-colors">
                  Redact PDF
                </Link>
              </li>
              <li>
                <Link href="/image/to-pdf" className="hover:text-[#4F46E5] transition-colors">
                  Images to A4 PDF
                </Link>
              </li>
              <li>
                <Link href="/convert/markdown-to-pdf" className="hover:text-[#4F46E5] transition-colors">
                  Markdown to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Image Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/image/compress" className="hover:text-[#4F46E5] transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/image/resize" className="hover:text-[#4F46E5] transition-colors">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/image/crop" className="hover:text-[#4F46E5] transition-colors">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link href="/svg/viewer" className="hover:text-[#4F46E5] transition-colors">
                  SVG Viewer Studio
                </Link>
              </li>
              <li>
                <Link href="/security/exif-remove" className="hover:text-[#4F46E5] transition-colors">
                  EXIF Stripper
                </Link>
              </li>
              <li>
                <Link href="/ocr/image" className="hover:text-[#4F46E5] transition-colors">
                  Image OCR (WASM)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Workspace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#4F46E5] transition-colors">
                  About Architect
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-[#4F46E5] transition-colors flex items-center gap-1.5">
                  <span>Roadmap & Phase 3</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#4F46E5] transition-colors">
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[#4F46E5] transition-colors">
                  All 177+ Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-[#4F46E5] transition-colors">
                  SHA-256 Verifier
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#4F46E5] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#4F46E5] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#4F46E5] transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#4F46E5] transition-colors">
                  XML Sitemap
                </Link>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Files processed in browser RAM and deleted automatically.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} <span className="text-[var(--text-main)] font-bold">trysomenew</span>. Engineered by{" "}
            <Link href="/about" className="text-[var(--text-main)] hover:text-[#4F46E5] font-semibold underline underline-offset-4 decoration-[#4F46E5]/40">
              Smrutiranjan Sahoo
            </Link>.
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--text-main)] font-mono text-[10px] border border-[var(--border-card)]">
                /
              </kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--text-main)] font-mono text-[10px] border border-[var(--border-card)]">
                ⌘K
              </kbd>
              <span>for quick search</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Client-Side</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
