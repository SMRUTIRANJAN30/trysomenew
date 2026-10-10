"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { CATEGORY_TINTS, ToolCategory } from "@/config/tools";

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

  const categories: {
    id: ToolCategory;
    title: string;
    tools: { name: string; href: string; badge?: string }[];
  }[] = [
    {
      id: "pdf",
      title: "PDF Tools",
      tools: [
        { name: "Merge PDF", href: "/pdf/merge", badge: "Hot" },
        { name: "Split PDF", href: "/pdf/split" },
        { name: "Compress PDF", href: "/pdf/compress" },
        { name: "PDF Redact", href: "/pdf/redact" },
        { name: "PDF to JPG", href: "/pdf/to-image" },
        { name: "Rotate PDF", href: "/pdf/rotate" },
      ],
    },
    {
      id: "image",
      title: "Image Tools",
      tools: [
        { name: "Image to PDF", href: "/image/to-pdf", badge: "Popular" },
        { name: "Compress Image", href: "/image/compress" },
        { name: "Resize Image", href: "/image/resize" },
        { name: "Crop Image", href: "/image/crop" },
        { name: "SVG Studio", href: "/svg/viewer" },
        { name: "EXIF Stripper", href: "/security/exif-remove" },
      ],
    },
    {
      id: "text",
      title: "Text & AI",
      tools: [
        { name: "Image OCR (WASM)", href: "/ocr/image", badge: "Fast" },
        { name: "Document Summarizer", href: "/ai/summarize" },
        { name: "Chat with PDF", href: "/ai/chat" },
        { name: "Markdown to PDF", href: "/convert/markdown-to-pdf" },
        { name: "Diff Checker", href: "/developer/diff" },
        { name: "Word Counter", href: "/text/word-counter" },
      ],
    },
    {
      id: "converters",
      title: "Converters & Dev",
      tools: [
        { name: "Invoice Generator", href: "/business/invoice" },
        { name: "Screen Recorder", href: "/misc/screen-record" },
        { name: "JSON Formatter", href: "/developer/json" },
        { name: "QR Code Maker", href: "/qr/generator" },
        { name: "SHA-256 Verifier", href: "/verify" },
        { name: "Beam Live Sync", href: "/beam", badge: "New" },
      ],
    },
  ];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--ink)] hover:text-[var(--pine)] transition-colors rounded-[6px]"
        aria-expanded={isOpen}
      >
        <span>All Tools</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-[var(--pine)]" : "text-[var(--muted)]"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50 w-[840px] max-w-[90vw] animate-in fade-in duration-100">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] shadow-[var(--shadow-dropdown)] p-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((cat) => {
                const tint = CATEGORY_TINTS[cat.id];
                return (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: tint.text }}
                      />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                        {cat.title}
                      </h4>
                    </div>

                    <ul className="space-y-1 text-xs">
                      {cat.tools.map((tool) => (
                        <li key={tool.name}>
                          <Link
                            href={tool.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-1.5 rounded-[4px] hover:bg-[var(--sunken)] text-[var(--ink)] hover:text-[var(--pine)] transition-colors group"
                          >
                            <span className="font-medium">{tool.name}</span>
                            {tool.badge && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[var(--warning-tint)] text-[var(--warning)]">
                                {tool.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
              <span>All 177+ tools run locally in browser memory without server file uploads.</span>
              <Link
                href="/tools"
                onClick={() => setIsOpen(false)}
                className="font-semibold text-[var(--pine)] hover:underline flex items-center gap-1"
              >
                <span>Browse Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
