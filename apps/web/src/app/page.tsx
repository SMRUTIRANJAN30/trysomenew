"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ChevronDown,
  Layers,
  Radio,
  Copy,
  QrCode,
  ShieldCheck,
  Check,
} from "lucide-react";
import { TOOLS_CONFIG, CATEGORY_NAMES, CATEGORY_TINTS, ToolCategory } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { DynamicIcon } from "@/components/common/DynamicIcon";

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  const popularChips = [
    { label: "Merge PDF", href: "/pdf/merge" },
    { label: "Compress PDF", href: "/pdf/compress" },
    { label: "JPG to PDF", href: "/image/to-pdf" },
    { label: "Image OCR", href: "/ocr/image" },
    { label: "Redact PDF", href: "/pdf/redact" },
    { label: "Invoice Generator", href: "/business/invoice" },
  ];

  const mostUsedTools = TOOLS_CONFIG.slice(0, 8);

  const categoryGroups: ToolCategory[] = ["pdf", "image", "text", "converters", "developer"];

  const whyChoosePoints = [
    {
      number: "01",
      title: "100% In-Browser Execution",
      desc: "Your files never leave your computer. WebAssembly and client JavaScript perform conversions directly in your browser memory.",
    },
    {
      number: "02",
      title: "Zero Queue Delays & File Size Traps",
      desc: "Instant processing without waiting behind server queues or hitting hidden subscription paywalls after 2 files.",
    },
    {
      number: "03",
      title: "No Accounts, Watermarks, or Ads Tracking",
      desc: "Open any tool and start working immediately. No signup forms, no email collection, and no forced branding.",
    },
    {
      number: "04",
      title: "Instant Phone & PC Device Pairing",
      desc: "Beam signature feature connects phone camera, tablet, and laptop clipboard seamlessly with end-to-end encryption.",
    },
  ];

  const faqs = [
    {
      question: "Are my documents and photos uploaded to your servers?",
      answer:
        "No. Every tool runs completely client-side in your web browser. When you merge PDFs, optimize images, or run OCR, your files are read into local browser memory and never transmitted over the network.",
    },
    {
      question: "Is trysomenew completely free to use?",
      answer:
        "Yes, all 177+ tools are completely free with no usage limits, no credit card requirements, and no watermarks placed on your exported documents.",
    },
    {
      question: "How does the Beam live clipboard pairing work?",
      answer:
        "Beam creates a temporary peer channel using a 6-character room code or QR scan. Text and files are encrypted end-to-end in your browser using Web Crypto AES-GCM before transferring between devices.",
    },
    {
      question: "Can I use these tools on iPhone, Android, and tablets?",
      answer:
        "Yes. The entire platform is built mobile-first and works across iOS Safari, Android Chrome, Firefox, Edge, and macOS Safari without installing native apps.",
    },
    {
      question: "What is the maximum file size I can process?",
      answer:
        "Because processing occurs in your device RAM, you can comfortably process documents up to 100MB-200MB depending on your available device memory.",
    },
  ];

  return (
    <div className="w-full text-left">
      {/* 1. HERO SECTION (Left-Aligned + Tool Preview Mock) */}
      <section className="py-12 sm:py-16 md:py-20 border-b border-[var(--line)]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Left-aligned Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-[var(--ink)] leading-[1.12]">
                PDF, image and file tools that run in your browser
              </h1>

              <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl leading-relaxed">
                Fast, privacy-first tools for documents, conversions, text, and device pairing.
                Everything processes directly on your device with zero server storage.
              </p>

              {/* 640x56px Search Trigger */}
              <div className="max-w-[640px] pt-1">
                <button
                  onClick={openSearch}
                  className="w-full h-14 px-4 sm:px-5 bg-[var(--surface)] border border-[var(--line)] rounded-[6px] text-left text-sm sm:text-base text-[var(--muted)] flex items-center justify-between hover:border-[var(--pine)] transition-colors shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--pine)]" />
                    <span>Search 177+ tools (e.g. merge pdf, ocr, invoice)...</span>
                  </div>
                  <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono rounded bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]">
                    /
                  </kbd>
                </button>
              </div>

              {/* Popular Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[var(--muted)] mr-1">Popular:</span>
                {popularChips.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="px-2.5 py-1 text-xs font-medium bg-[var(--surface)] border border-[var(--line)] rounded-[6px] hover:border-[var(--pine)] hover:text-[var(--pine)] text-[var(--ink)] transition-colors"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Static Tool Page Preview Mock (No stock illustration) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[4px] bg-[var(--cat-pdf)] text-[#8A2810] flex items-center justify-center font-bold text-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--ink)]">Merge PDF</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--pine)] bg-[var(--pine-tint)] px-2 py-0.5 rounded">
                    Client-Side
                  </span>
                </div>

                {/* Dropzone preview */}
                <div className="border border-dashed border-[var(--line)] rounded-[6px] p-6 text-center bg-[var(--sunken)]/50 mb-4">
                  <div className="w-10 h-10 rounded-[6px] bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center mx-auto text-[var(--pine)] mb-2">
                    <Layers className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-[var(--ink)]">
                    Drop PDF files here to combine
                  </p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Drag to reorder pages before merging
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[var(--muted)]">2 files selected (3.4 MB)</span>
                  <Link href="/pdf/merge" className="btn-terracotta text-xs h-9 px-4">
                    Open Tool
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MOST USED TOOLS (2-Column Compact Rows) */}
      <section className="py-14 sm:py-16 max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 border-b border-[var(--line)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold">Most used tools</h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">
              Quick access to our core document and conversion utilities.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-semibold text-[var(--pine)] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>All 177+ tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mostUsedTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* 3. CATEGORY SECTIONS (Blocks with tinted icon tiles) */}
      <section className="py-14 sm:py-16 max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 border-b border-[var(--line)] space-y-12">
        {categoryGroups.map((catKey) => {
          const categoryTools = TOOLS_CONFIG.filter((t) => t.category === catKey).slice(0, 4);
          if (categoryTools.length === 0) return null;
          const catName = CATEGORY_NAMES[catKey];
          const tint = CATEGORY_TINTS[catKey];

          return (
            <div key={catKey} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tint.text }}
                  />
                  <h3 className="text-lg font-semibold">{catName}</h3>
                </div>
                <Link
                  href={`/tools?category=${catKey}`}
                  className="text-xs font-semibold text-[var(--pine)] hover:underline flex items-center gap-1"
                >
                  <span>See all {catName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. BEAM SIGNATURE SECTION (Split Layout) */}
      <section className="py-14 sm:py-16 max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 border-b border-[var(--line)]">
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 text-[var(--terracotta)]" />
                <span>Signature Feature</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold">
                Beam: Send text, links and files from phone to PC
              </h2>

              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                No sign-in, no cables, and no messaging yourself on WhatsApp. Scan a QR code on your phone
                or enter a 6-character code on your PC to sync in real time with end-to-end encryption.
              </p>

              <div className="pt-2">
                <Link href="/beam" className="btn-terracotta text-sm">
                  <span>Start Beam Session</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Right Column: QR + Code Mock */}
            <div className="lg:col-span-5 bg-[var(--sunken)] border border-[var(--line)] rounded-[6px] p-6 text-center space-y-4">
              <div className="inline-block p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[6px]">
                <div className="w-28 h-28 flex items-center justify-center bg-[var(--surface)] text-[var(--ink)]">
                  <QrCode className="w-24 h-24" />
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Pairing Code</div>
                <div className="font-mono text-2xl font-bold tracking-widest text-[var(--ink)]">
                  749 283
                </div>
              </div>

              <p className="text-[11px] text-[var(--muted)]">
                End-to-end encrypted with Web Crypto AES-GCM. Auto-expires in 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY PEOPLE USE IT (Short Numbered List) */}
      <section className="py-14 sm:py-16 max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 border-b border-[var(--line)]">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Why people use trysomenew</h2>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Built as a dependable, private alternative to ad-heavy document portals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoosePoints.map((item) => (
            <div key={item.number} className="space-y-2 border-t border-[var(--line)] pt-4">
              <span className="font-mono text-xs font-semibold text-[var(--pine)]">
                {item.number}
              </span>
              <h4 className="text-base font-semibold text-[var(--ink)]">{item.title}</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="py-14 sm:py-16 max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Frequently asked questions</h2>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Clear, honest answers about privacy, file processing, and device support.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-[6px] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 text-left font-semibold text-sm sm:text-base text-[var(--ink)] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--muted)] transition-transform duration-150 shrink-0 ${
                      isOpen ? "rotate-180 text-[var(--pine)]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--line)] pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
