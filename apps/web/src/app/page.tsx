"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Gift,
  ChevronDown,
  Flame,
  ArrowRight,
  Layers,
  Lock,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { TOOLS, ToolDefinition } from "@/lib/toolsData";
import { ToolCard } from "@/components/common/ToolCard";
import { CategoryTabs, CategoryFilter } from "@/components/common/CategoryTabs";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Trigger search palette via event
  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
  };

  // Top 8 Popular Tools placed ABOVE full grid
  const popularTools = useMemo(() => {
    return TOOLS.filter((t) => t.isPopular && t.status === "ready").slice(0, 8);
  }, []);

  // Filter tools based on active category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (tool.status !== "ready") return false;
      const cat = tool.category.toLowerCase();

      if (activeTab === "all") return true;
      if (activeTab === "pdf") {
        return cat.includes("pdf") || cat.includes("signature") || cat.includes("watermark");
      }
      if (activeTab === "image") {
        return cat.includes("image") || cat.includes("svg") || cat.includes("color");
      }
      if (activeTab === "video") {
        return cat.includes("video") || cat.includes("audio") || cat.includes("media") || cat.includes("gif");
      }
      if (activeTab === "text") {
        return cat.includes("text") || cat.includes("ai") || cat.includes("ocr") || cat.includes("education");
      }
      if (activeTab === "converters") {
        return cat.includes("convert") || cat.includes("calc") || cat.includes("qr") || cat.includes("barcode") || cat.includes("business");
      }
      if (activeTab === "developer") {
        return cat.includes("developer") || cat.includes("security") || cat.includes("archive") || cat.includes("transfer") || cat.includes("clipboard");
      }
      return true;
    });
  }, [activeTab]);

  // Counts for tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: 0,
      pdf: 0,
      image: 0,
      video: 0,
      text: 0,
      converters: 0,
      developer: 0,
    };

    for (const tool of TOOLS) {
      if (tool.status !== "ready") continue;
      counts.all++;
      const cat = tool.category.toLowerCase();
      if (cat.includes("pdf") || cat.includes("signature") || cat.includes("watermark")) counts.pdf++;
      if (cat.includes("image") || cat.includes("svg") || cat.includes("color")) counts.image++;
      if (cat.includes("video") || cat.includes("audio") || cat.includes("media") || cat.includes("gif")) counts.video++;
      if (cat.includes("text") || cat.includes("ai") || cat.includes("ocr") || cat.includes("education")) counts.text++;
      if (cat.includes("convert") || cat.includes("calc") || cat.includes("qr") || cat.includes("barcode") || cat.includes("business")) counts.converters++;
      if (cat.includes("developer") || cat.includes("security") || cat.includes("archive") || cat.includes("transfer") || cat.includes("clipboard")) counts.developer++;
    }

    return counts;
  }, []);

  const popularChips = [
    { label: "Merge PDF", href: "/pdf/merge" },
    { label: "Compress PDF", href: "/pdf/compress" },
    { label: "JPG to PDF", href: "/image/to-pdf" },
    { label: "Image OCR", href: "/ocr/image" },
    { label: "PDF Redact", href: "/pdf/redact" },
    { label: "Invoice Generator", href: "/business/invoice" },
    { label: "Screen Recorder", href: "/misc/screen-record" },
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Ultra Fast",
      desc: "Processed client-side in milliseconds using WebAssembly & modern browser engines without queue delays.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Secure & Private",
      desc: "Zero-storage guarantee. Your documents never upload to external servers and never leave your computer.",
    },
    {
      icon: <Gift className="w-6 h-6 text-indigo-500" />,
      title: "100% Free Forever",
      desc: "No hidden subscriptions, no file size paywalls, and no account registration required. Just open and work.",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-blue-500" />,
      title: "Works on Any Device",
      desc: "Fully responsive across iOS, Android, Windows, Mac, and Linux with full Progressive Web App (PWA) support.",
    },
  ];

  const faqs = [
    {
      q: "Is trysomenew completely free without hidden limits?",
      a: "Yes! Every single tool on trysomenew is 100% free with no watermarks, no registration, and no hidden file size paywalls.",
    },
    {
      q: "Are my sensitive files uploaded to your servers?",
      a: "No. Unlike legacy cloud converters, trysomenew runs operations directly inside your browser memory using WebAssembly, Canvas, and WebCrypto. Your files never leave your device.",
    },
    {
      q: "How does the Image and PDF OCR work?",
      a: "We execute a compiled WebAssembly optical character recognition pipeline inside your browser that scans images or PDF pages and pulls text streams locally in seconds.",
    },
    {
      q: "Can I use trysomenew offline on mobile or desktop?",
      a: "Yes! trysomenew is engineered as a modern Progressive Web App (PWA). You can install it to your home screen or desktop dock and access tools offline without an internet connection.",
    },
    {
      q: "How does cryptographic document verification work?",
      a: "TrySomeNew computes a genuine SHA-256 cryptographic digest of your file's binary stream using the native browser WebCrypto API. If even a single byte is altered, verification fails immediately.",
    },
  ];

  // FAQ Schema for SEO rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="w-full">
      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION (80px top/bottom padding, max 1200px) */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 max-w-[1200px] mx-auto text-center">
        {/* Subtle decorative aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-semibold text-[var(--text-muted)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Fast, Private, Zero-Cloud Document Workspace</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="text-[#4F46E5] font-bold">177+ Tools</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[var(--text-main)] leading-[1.15]">
            Free Online Tools to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#F97316] bg-clip-text text-transparent">
              Convert, Compress and Edit Files
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto font-medium">
            177+ fast, secure tools. No signup. Files processed locally in your browser.
          </p>

          {/* HUGE SEARCH BAR (720px max width, 60px height, rounded-2xl) */}
          <div className="pt-4 max-w-[720px] mx-auto">
            <button
              onClick={openSearch}
              className="w-full h-[60px] px-5 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border-card)] hover:border-[#4F46E5] text-[var(--text-muted)] flex items-center justify-between shadow-lg shadow-black/5 hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <Search className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[#4F46E5] transition-colors" />
                <span className="text-sm sm:text-base font-medium">
                  Search 177+ tools... e.g. image to pdf, reduce size
                </span>
              </div>
              <kbd className="hidden sm:flex items-center justify-center h-7 px-2.5 rounded-lg bg-black/5 dark:bg-white/10 border border-[var(--border-card)] font-mono text-xs text-[var(--text-main)] group-hover:border-[#4F46E5] transition-colors">
                /
              </kbd>
            </button>

            {/* Popular quick chips */}
            <div className="pt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
              <span className="text-[var(--text-muted)] font-semibold mr-1">Popular:</span>
              {popularChips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] hover:border-[#4F46E5] hover:text-[#4F46E5] font-medium transition-colors shadow-2xs"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS (Sticky below header) */}
      <CategoryTabs activeTab={activeTab} onChange={setActiveTab} counts={categoryCounts} />

      {/* 3. MAIN CONTENT CONTAINER (max 1200px, 24px padding) */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 4. MOST POPULAR TOOLS (Top 8 above full grid) */}
        {activeTab === "all" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Flame size={18} className="fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                    Most Popular Tools
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Quick access to our highest-trafficked productivity utilities.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Columns Desktop, 2 Tablet, 1 Mobile, Gap 20px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* 5. FULL CATEGORY TOOL GRID (4 cols desktop, 2 cols tablet, 1-2 mobile, gap 20px) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                {activeTab === "all" ? "All Online Tools" : `${activeTab.toUpperCase()} Tools`}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Showing {filteredTools.length} tools ready to use locally.
              </p>
            </div>
            <button
              onClick={openSearch}
              className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
            >
              <span>Instant Search</span>
              <Search size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* 6. WHY CHOOSE US - 4 ICON BLOCKS */}
        <section className="pt-8 border-t border-[var(--border-card)] space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Why Choose trysomenew?
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Designed from the ground up for speed, privacy, and zero compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-3 shadow-xs hover:border-[#4F46E5]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS (Accordion with Schema) */}
        <section className="pt-8 border-t border-[var(--border-card)] max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Everything you need to know about our local-first tool suite.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-bold text-sm sm:text-base text-[var(--text-main)] flex items-center justify-between gap-4 cursor-pointer hover:text-[#4F46E5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#4F46E5]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-card)]/50 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
