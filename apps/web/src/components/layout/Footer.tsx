import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Zap, Lock, Sparkles, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--footer-bg)] border-t border-[var(--border-subtle)] text-[var(--muted)] text-sm mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[var(--background)] rounded-[7px] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-500" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">trysomenew</span>
            </Link>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed max-w-sm">
              The AI-native, all-in-one document workspace designed for speed, privacy, and cross-device fluidity.
              Process PDFs, verify cryptographic integrity, and move files across devices without leaving your browser.
            </p>

            {/* Privacy Promise Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-Storage Guarantee for Local Tools</span>
            </div>
          </div>

          {/* Column 1: PDF Tools */}
          <div>
            <h4 className="text-[var(--foreground)] text-xs font-semibold uppercase tracking-wider mb-3">PDF Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pdf/merge" className="hover:text-blue-500 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/split" className="hover:text-blue-500 transition-colors">
                  Split & Extract Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/rotate" className="hover:text-blue-500 transition-colors">
                  Rotate Pages
                </Link>
              </li>
              <li>
                <Link href="/pdf/compress" className="hover:text-blue-500 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/image/to-pdf" className="hover:text-blue-500 transition-colors">
                  Images to A4 PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf/to-image" className="hover:text-blue-500 transition-colors">
                  PDF to JPG & PNG
                </Link>
              </li>
              <li>
                <Link href="/pdf/view" className="hover:text-blue-500 transition-colors">
                  PDF Viewer & Metadata
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Verification & Transfer */}
          <div>
            <h4 className="text-[var(--foreground)] text-xs font-semibold uppercase tracking-wider mb-3">Integrity & Device</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/verify" className="hover:text-blue-500 transition-colors">
                  Cryptographic Verification
                </Link>
              </li>
              <li>
                <Link href="/security/hash-file" className="hover:text-blue-500 transition-colors">
                  Part Hash Inspector
                </Link>
              </li>
              <li>
                <Link href="/clipboard" className="hover:text-blue-500 transition-colors">
                  Online Clipboard
                </Link>
              </li>
              <li>
                <Link href="/transfer" className="hover:text-blue-500 transition-colors">
                  QuickSend File Transfer
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-blue-500 transition-colors">
                  Tools Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Architecture & Creator */}
          <div>
            <h4 className="text-[var(--foreground)] text-xs font-semibold uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-[var(--muted)]">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>WebAssembly & Canvas</span>
              </li>
              <li className="flex items-center gap-1.5 text-[var(--muted)]">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                <span>WebCrypto SHA-256</span>
              </li>
              <li className="flex items-center gap-1.5 text-[var(--muted)]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>P2P WebRTC Signaling</span>
              </li>
              <li className="pt-2 border-t border-[var(--border-subtle)]">
                <Link href="/about" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-semibold transition-colors">
                  <span>Architect: Smrutiranjan Sahoo</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted-text)]">
          <div>
            © {new Date().getFullYear()} <span className="text-[var(--foreground)] font-semibold">trysomenew</span>. Engineered by{" "}
            <Link href="/about" className="text-[var(--foreground)] hover:text-blue-500 font-semibold underline underline-offset-4 decoration-blue-500/50">
              Smrutiranjan Sahoo
            </Link>.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
              Developer Profile
            </Link>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1.5">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[var(--foreground)] font-mono text-[10px] border border-[var(--border-subtle)]">
                ⌘K
              </kbd>
              <span>for quick search</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>Local-First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
