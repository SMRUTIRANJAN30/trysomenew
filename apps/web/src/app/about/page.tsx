"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  FileText,
  Share2,
  ExternalLink,
  Award,
  Terminal,
} from "lucide-react";

export default function AboutDeveloperPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Hero Developer Card */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-950/40 via-slate-900/60 to-black/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar / Badge */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[2px] shadow-xl shadow-blue-500/20">
              <div className="w-full h-full rounded-[22px] bg-[#090e1a] flex flex-col items-center justify-center text-center p-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-1">
                  <Terminal size={26} />
                </div>
                <span className="text-[11px] font-mono text-cyan-300 font-bold tracking-wider">DEV</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
              <CheckCircle2 size={11} /> Verified
            </div>
          </div>

          {/* Bio & Intro */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={13} />
              Platform Creator & Architect
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Smrutiranjan Sahoo
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Creator and Lead Engineer of <strong className="text-white">trysomenew</strong> — the next-generation, local-first document productivity and file intelligence ecosystem.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                href="/tools"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
              >
                Explore All Tools <ArrowRight size={14} />
              </Link>
              <Link
                href="/verify"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <ShieldCheck size={15} className="text-emerald-400" />
                Document Verification
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Smrutiranjan Built TrySomeNew */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Smrutiranjan Sahoo Built TrySomeNew
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Fixing the broken document tools industry with local-first, zero-knowledge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Absolute Data Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional document sites force users to upload confidential contracts, bank statements, and tax IDs to unknown cloud servers. Smrutiranjan built <strong>trysomenew</strong> so your documents never leave your device.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Instant Browser Speeds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No slow upload queues, waiting times, or paywalls. By leveraging WebAssembly, HTML5 Canvas, and WebCrypto APIs, tasks finish in milliseconds locally on your hardware.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h3 className="text-base font-bold text-white">All-in-One Powerhouse</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instead of juggling 15 different websites for PDF editing, image conversion, hash checking, QR codes, and P2P transfer, everything is unified seamlessly in one cohesive workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Innovations Built into TrySomeNew */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Architectural Innovations Crafted by Smrutiranjan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Key capabilities engineered specifically for high-efficiency daily workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Interactive Image Part Hash Inspector",
              desc: "Allows clicking any tile or region of an image to compute that exact part's SHA-256 and MD5 cryptographic hash, plus byte-chunk map analysis for raw files.",
              badge: "Cryptographic",
            },
            {
              title: "Strict File Extension Search Engine",
              desc: "Intelligent format detection: searching 'png' strictly isolates PNG tools, hiding unrelated PDF-only tools for faster developer navigation.",
              badge: "UX / Search",
            },
            {
              title: "Standard A4 Page Normalization",
              desc: "Integrated A4 page converter in PDF merge, split, and multi-image generation, standardizing non-uniform scans to standard 595 × 842 pt dimensions.",
              badge: "Document Prep",
            },
            {
              title: "Black-to-White Document Background Cleaning",
              desc: "Automated inversion of dark backgrounds to clean white and high-contrast B&W thresholding for scans, receipts, and dark-mode captures.",
              badge: "Canvas / AI",
            },
            {
              title: "Universal Drag-and-Drop Up/Down Reordering",
              desc: "Fluid page and file sorting with drag-and-drop handles and dedicated touch-friendly arrow controls in PDF Merge, Image-to-PDF, and ZIP.",
              badge: "Workflow",
            },
            {
              title: "P2P WebRTC QuickSend & Realtime Clipboard",
              desc: "Direct browser-to-browser peer-to-peer file transfer and room-based text sync with zero middleman storage.",
              badge: "Networking",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass rounded-2xl p-5 border border-white/5 hover:border-blue-500/20 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-semibold uppercase">
                  {item.badge}
                </span>
                <span className="text-xs font-mono text-slate-600">0{idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-200">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Blueprint */}
      <div className="glass rounded-3xl p-8 border border-white/10 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="text-cyan-400" size={20} />
          Technical Stack & Engineering Philosophy
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-slate-500 font-mono">Framework</p>
            <p className="text-sm font-bold text-white mt-1">Next.js 16 (Turbopack)</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-slate-500 font-mono">Language</p>
            <p className="text-sm font-bold text-white mt-1">TypeScript 5+</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-slate-500 font-mono">PDF Processing</p>
            <p className="text-sm font-bold text-white mt-1">pdf-lib (Client-Side)</p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-slate-500 font-mono">Cryptography</p>
            <p className="text-sm font-bold text-white mt-1">WebCrypto & SparkMD5</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-4">
          Engineered by <strong>Smrutiranjan Sahoo</strong> following strict modern software craftsmanship standards: local-first execution, resilient error handling, accessible touch navigation, zero telemetry of user document bytes, and sub-100ms response targets.
        </p>
      </div>

      {/* Footer Signature */}
      <div className="text-center py-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Designed & Engineered with pride by <strong className="text-slate-300">Smrutiranjan Sahoo</strong></span>
        <div className="flex items-center gap-4">
          <Link href="/tools" className="text-blue-400 hover:text-blue-300 transition-colors">
            Explore 100+ Tools
          </Link>
          <span>•</span>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            trysomenew Home
          </Link>
        </div>
      </div>
    </div>
  );
}
