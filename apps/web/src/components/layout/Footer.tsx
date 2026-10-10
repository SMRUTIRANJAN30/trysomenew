import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--sunken)] border-t border-[var(--line)] text-[var(--muted)] text-sm mt-24 transition-colors">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-14">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Logo size="footer" />
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Fast, privacy-first document and file tools that process completely in your browser memory. Nothing is stored on our servers.
            </p>

            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[var(--surface)] border border-[var(--line)] text-[var(--pine)] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[var(--pine)]" />
                <span>Zero-Storage Guarantee</span>
              </div>
            </div>
          </div>

          {/* Column 2: PDF Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf/merge" className="hover:text-[var(--pine)] transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/split" className="hover:text-[var(--pine)] transition-colors">
                  Split & Extract Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/compress" className="hover:text-[var(--pine)] transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/redact" className="hover:text-[var(--pine)] transition-colors">
                  Redact PDF
                </Link>
              </li>
              <li>
                <Link href="/image/to-pdf" className="hover:text-[var(--pine)] transition-colors">
                  Images to A4 PDF
                </Link>
              </li>
              <li>
                <Link href="/convert/markdown-to-pdf" className="hover:text-[var(--pine)] transition-colors">
                  Markdown to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Image Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Image Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/image/compress" className="hover:text-[var(--pine)] transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/image/resize" className="hover:text-[var(--pine)] transition-colors">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link href="/image/crop" className="hover:text-[var(--pine)] transition-colors">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link href="/svg/viewer" className="hover:text-[var(--pine)] transition-colors">
                  SVG Viewer Studio
                </Link>
              </li>
              <li>
                <Link href="/security/exif-remove" className="hover:text-[var(--pine)] transition-colors">
                  EXIF Stripper
                </Link>
              </li>
              <li>
                <Link href="/ocr/image" className="hover:text-[var(--pine)] transition-colors">
                  Image OCR (WASM)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Workspace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[var(--pine)] transition-colors">
                  About Architect
                </Link>
              </li>
              <li>
                <Link href="/beam" className="hover:text-[var(--pine)] transition-colors flex items-center gap-1.5">
                  <span>Beam Live Sync</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--pine-tint)] text-[var(--pine)] font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--pine)] transition-colors">
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-[var(--pine)] transition-colors">
                  All 177+ Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-[var(--pine)] transition-colors">
                  SHA-256 Verifier
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[var(--pine)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--pine)] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--pine)] transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[var(--pine)] transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <div>
            © {new Date().getFullYear()} <span className="text-[var(--ink)] font-semibold">trysomenew</span>. Engineered by{" "}
            <Link href="/about" className="text-[var(--ink)] hover:text-[var(--pine)] font-semibold underline underline-offset-4 decoration-[var(--pine)]/40">
              Smrutiranjan Sahoo
            </Link>.
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>
              Press <kbd className="font-mono px-1 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)]">/</kbd> for quick search
            </span>
            <span>•</span>
            <span className="text-[var(--pine)] font-medium">100% Client-Side Processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
