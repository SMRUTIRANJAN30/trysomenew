"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Layers,
  Split,
  Minimize2,
  Image as ImageIcon,
  ScanText,
  Sparkles,
  Receipt,
  PenTool,
  ShieldCheck,
  Video,
  FileCode,
  ArrowRight,
  Flame,
} from "lucide-react";
import { getCategoryTheme } from "@/lib/categoryTheme";

interface MegaMenuProps {
  onClose?: () => void;
}

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[var(--text-main)] hover:text-[#4F46E5] transition-colors rounded-xl"
        aria-expanded={isOpen}
      >
        <span>All Tools</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#4F46E5]" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[880px] max-w-[95vw] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl p-6 overflow-hidden">
            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Column 1: PDF Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-card)]">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    PDF Tools
                  </h4>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/pdf/merge"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] group"
                    >
                      <span className="group-hover:text-[#4F46E5] font-medium">Merge PDF</span>
                      <span className="text-[10px] text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded font-bold">Hot</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pdf/split"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Split & Extract Pages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pdf/compress"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Compress PDF
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pdf/redact"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      <span>Redact PDF</span>
                      <span className="text-[10px] text-cyan-600 bg-cyan-500/10 px-1.5 py-0.2 rounded font-bold">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/image/to-pdf"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      JPG & PNG to PDF
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/convert/markdown-to-pdf"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Markdown to PDF
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Image Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-card)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    Image & SVG
                  </h4>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/image/compress"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Compress Image
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/image/resize"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Resize Image
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/image/crop"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Crop Image
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/svg/viewer"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      SVG Viewer & Code
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/security/exif-remove"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      EXIF Metadata Remover
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/color/converter"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Color Converter Studio
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: AI & OCR Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-card)]">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    AI & OCR
                  </h4>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/ocr/image"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      <span>Image OCR (WASM)</span>
                      <span className="text-[10px] text-cyan-600 bg-cyan-500/10 px-1.5 py-0.2 rounded font-bold">Fast</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ocr/pdf"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Scanned PDF OCR
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai/summarize"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      AI Document Summarizer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai/chat"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Chat with PDF
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai/transcribe"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Speech to Text Dictation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ai/tts"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Text to Speech (TTS)
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Business & Security */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-card)]">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    Business & Sign
                  </h4>
                </div>
                <ul className="space-y-1 text-xs">
                  <li>
                    <Link
                      href="/business/invoice"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      <span>Invoice Generator</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">PDF</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/business/receipt"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Receipt Generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign/draw"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Draw Digital Signature
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sign/type"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Calligraphy Signatures
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/misc/screen-record"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      Screen Recorder (HD)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/verify"
                      onClick={() => setIsOpen(false)}
                      className="block p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:text-[#4F46E5] font-medium"
                    >
                      SHA-256 Verifier
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-6 pt-4 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-[var(--text-muted)]">
                <span>⚡ 100% Client-Side Processing</span>
                <span>•</span>
                <span>🔒 Zero Server File Storage</span>
              </div>
              <Link
                href="/tools"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 transition-colors"
              >
                <span>Browse All 177+ Tools</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
