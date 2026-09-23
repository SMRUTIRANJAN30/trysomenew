"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  Layers,
  Split,
  RotateCw,
  Minimize2,
  Image as ImageIcon,
  ClipboardCopy,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Smartphone,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { GlobalFileUploader } from "@/components/upload/GlobalFileUploader";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";
import { TOOLS } from "@/lib/toolsData";
import { DynamicIcon } from "@/components/common/DynamicIcon";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"all" | "pdf" | "convert" | "verify" | "transfer">("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const popularTools = TOOLS.filter((t) => t.isPopular && t.status === "ready");

  const filteredTools = TOOLS.filter((tool) => {
    if (activeTab === "all") return true;
    if (activeTab === "pdf") return tool.category === "pdf" || tool.category === "pdf-convert" || tool.category === "pdf-edit" || tool.category === "pdf-security";
    if (activeTab === "convert") return tool.category === "pdf-convert" || tool.category === "image";
    if (activeTab === "verify") return tool.category === "signature-verify" || tool.category === "security-privacy";
    if (activeTab === "transfer") return tool.category === "transfer" || tool.category === "clipboard";
    return true;
  });

  const faqs = [
    {
      q: "Does TrySomeNew upload my files to any server?",
      a: "No! For all local tools (Merge, Split, Rotate, Compress, PDF to Image, and SHA-256 Verification), files are processed 100% inside your browser using WebAssembly and client-side memory. Your documents never leave your device.",
    },
    {
      q: "How does cryptographic document verification work?",
      a: "TrySomeNew computes a genuine SHA-256 cryptographic digest of your file's binary stream using the native browser WebCrypto API. We issue a unique Document ID and verification record. If even a single byte or character is modified, the hash mismatches and verification will accurately fail.",
    },
    {
      q: "How does QuickSend and Online Clipboard work across devices?",
      a: "Our Online Clipboard and QuickSend utilities use ephemeral rooms and peer-to-peer WebRTC channels. You scan a QR code from your phone or enter a 6-digit room code to instantly send text, links, or files directly between your desktop and mobile device without persistent cloud storage.",
    },
    {
      q: "Can I use TrySomeNew on mobile devices?",
      a: "Yes! The platform is designed mobile-first with touch-friendly controls, responsive layout, and can be installed as a Progressive Web App (PWA) directly to your home screen.",
    },
    {
      q: "Is TrySomeNew free to use?",
      a: "Yes, all core client-side document processing tools, verification tools, clipboard, and transfers are completely free with zero ads and no required account.",
    },
  ];

  return (
    <div className="w-full space-y-24">
      {/* 1. HERO SECTION WITH SMART FILE UPLOADER */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--muted)] backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Fast, Private, Zero-Cloud Document Workspace</span>
            <span className="text-[var(--muted-text)]">•</span>
            <span className="text-blue-500 font-semibold">trysomenew</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight">
            Everything you need for <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              documents & files.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Convert. Edit. Sign. Verify. Analyze. And move files seamlessly between your devices in seconds.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <ProcessingBadge mode="local" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--card-bg)] text-[var(--muted)] border border-[var(--border-subtle)]">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Client-Side Execution</span>
            </div>
          </div>
        </div>

        {/* Global Smart File Uploader */}
        <div className="mt-10 max-w-3xl mx-auto">
          <GlobalFileUploader />
        </div>
      </section>

      {/* 2. POPULAR TOOLS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Popular Document Tools
            </h2>
            <p className="text-sm text-[var(--muted-text)] mt-1">
              Tested, production-grade tools running directly in your browser.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <span>View all 20+ tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group p-5 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--card-border)] hover:border-blue-500/50 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                  <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-blue-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-[var(--muted-text)] mt-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Local Engine</span>
                </span>
                <span className="text-[var(--muted-text)] group-hover:text-blue-500 flex items-center gap-1 font-medium transition-colors">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Organized Product Suites
          </h2>
          <p className="text-sm text-[var(--muted-text)] mt-2">
            No endless unorganized buttons. Find what you need by product workflow.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: "all", label: "All Suites" },
              { id: "pdf", label: "PDF Tools" },
              { id: "convert", label: "Conversion" },
              { id: "verify", label: "Verification" },
              { id: "transfer", label: "Devices & Sync" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg-hover)] border border-[var(--card-border)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.status === "ready" ? tool.href : "/tools#" + tool.category}
              className={`p-5 rounded-2xl border transition-all ${
                tool.status === "ready"
                  ? "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-blue-500/40 hover:bg-[var(--card-bg-hover)] shadow-sm"
                  : "bg-[var(--card-bg)]/60 border-[var(--border-subtle)] opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                </div>
                {tool.status === "ready" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/30">
                    Ready
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted-text)] font-semibold border border-[var(--border-subtle)]">
                    Roadmap Phase 2
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-[var(--foreground)] mt-3">{tool.name}</h4>
              <p className="text-xs text-[var(--muted-text)] mt-1 leading-relaxed">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. DIFFERENTIATOR SPOTLIGHT: CRYPTOGRAPHIC VERIFICATION & CROSS-DEVICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Cryptographic Verification */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Authentic Cryptographic Verification
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Never trust a simple green checkmark. TrySomeNew computes a genuine SHA-256 integrity hash of document streams and maintains a verifiable receipt registry. Detect tampering or byte modification instantly.
              </p>

              <div className="bg-black/5 dark:bg-black/40 rounded-xl p-4 border border-[var(--border-subtle)] font-mono text-xs space-y-1.5 text-[var(--foreground)]">
                <div className="text-[var(--muted-text)] flex justify-between">
                  <span>Document ID:</span>
                  <span className="text-cyan-500 dark:text-cyan-400 font-semibold">DOC-2026-A82F91</span>
                </div>
                <div className="text-[var(--muted-text)] flex justify-between">
                  <span>Integrity Status:</span>
                  <span className="text-emerald-500 font-semibold">UNCHANGED ✓</span>
                </div>
                <div className="text-[var(--muted-text)] flex justify-between">
                  <span>Algorithm:</span>
                  <span className="text-[var(--foreground)]">SHA-256 (256-bit digest)</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/20"
              >
                <span>Verify or Register a Document</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: QuickSend Cross-Device & Online Clipboard */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                Cross-Device Clipboard & Transfer
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Connect your laptop, phone, and tablet instantly with a 6-digit room code or QR scan. Share text snippets, links, and documents peer-to-peer without messaging yourself on chat apps.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/clipboard"
                  className="p-3 bg-black/5 dark:bg-black/40 border border-[var(--border-subtle)] rounded-xl hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                    <ClipboardCopy className="w-4 h-4 text-blue-500" />
                    <span>Online Clipboard</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-text)] mt-1">Realtime text sync</p>
                </Link>
                <Link
                  href="/transfer"
                  className="p-3 bg-black/5 dark:bg-black/40 border border-[var(--border-subtle)] rounded-xl hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                    <Send className="w-4 h-4 text-cyan-500" />
                    <span>QuickSend P2P</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-text)] mt-1">Zero cloud storage</p>
                </Link>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/transfer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Launch QuickSend Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY & LOCAL-FIRST SECURITY ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)]">
            Privacy-First Architecture by Design
          </h2>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
            Traditional document tools upload your sensitive contracts, tax records, and medical files to third-party cloud servers. TrySomeNew was engineered from scratch with a local-first browser runtime.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <div className="bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] p-4 rounded-xl">
              <div className="text-emerald-500 text-xs font-bold mb-1">01 / Zero Server Upload</div>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                PDF merging, splitting, rotation, and compression run purely in your device&apos;s WebAssembly & memory.
              </p>
            </div>
            <div className="bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] p-4 rounded-xl">
              <div className="text-blue-500 text-xs font-bold mb-1">02 / Cryptographic Integrity</div>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                Standard NIST SHA-256 hashing verifies document purity without storing file contents.
              </p>
            </div>
            <div className="bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] p-4 rounded-xl">
              <div className="text-indigo-500 text-xs font-bold mb-1">03 / Ephemeral P2P Transfer</div>
              <p className="text-xs text-[var(--muted-text)] leading-relaxed">
                QuickSend rooms create direct browser connections. No permanent file backups stored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[var(--muted-text)] mt-2">
            Clear, honest answers about our technology and privacy model.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-[var(--foreground)] font-semibold text-sm hover:text-blue-500 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--muted-text)] flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[var(--muted)] leading-relaxed border-t border-[var(--border-subtle)] pt-3 animate-in fade-in duration-150">
                    {faq.a}
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
