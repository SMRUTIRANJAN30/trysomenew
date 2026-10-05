"use client";

import ToolShell from "@/components/tools/ToolShell";
import { CheckCircle2, Clock, Sparkles, Cpu, ShieldCheck, Zap, Layers, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PhaseItem {
  name: string;
  desc: string;
  status: "completed" | "in-progress" | "planned";
  tag: string;
  href?: string;
}

export default function RoadmapPage() {
  const phase1Items: PhaseItem[] = [
    { name: "Local-First PDF Toolbox", desc: "Merge, split, rotate, compress, and rasterize PDFs to images 100% locally in browser memory.", status: "completed", tag: "PDF", href: "/pdf/merge" },
    { name: "Cryptographic SHA-256 Engine", desc: "Authentic binary hash computation, verifiable Document IDs, and bitwise tamper auditing.", status: "completed", tag: "Security", href: "/verify" },
    { name: "Cross-Device Online Clipboard", desc: "Ephemeral room-based text, code, and link synchronization with instant QR pairing.", status: "completed", tag: "Sync", href: "/clipboard" },
    { name: "QuickSend P2P Transfer", desc: "Direct browser-to-browser WebRTC file transfer up to 100 MB without permanent cloud retention.", status: "completed", tag: "P2P", href: "/transfer" },
    { name: "Global Command Palette (Ctrl+K)", desc: "Instant fuzzy search across the entire workspace tool catalogue with keyboard shortcuts.", status: "completed", tag: "UX" },
  ];

  const phase2Items: PhaseItem[] = [
    { name: "Full Developer Toolkit", desc: "JSON/YAML/XML converters, Base64, UUID, Cron parser, JWT decoder, and Markdown editor.", status: "completed", tag: "Developer", href: "/developer/json" },
    { name: "Code Formatters & Minifiers", desc: "Beautifiers and minifiers for HTML, CSS, JavaScript, and standardized SQL queries.", status: "completed", tag: "Code", href: "/developer/html" },
    { name: "Vector & SVG Suite", desc: "SVG previewer, code optimizer, SVG to PNG rasterization, and Data URI generator.", status: "completed", tag: "Vector", href: "/svg/viewer" },
    { name: "Client-Side EXIF & Privacy Stripper", desc: "Permanent removal of GPS coordinates, camera serial numbers, and device metadata.", status: "completed", tag: "Privacy", href: "/security/exif-remove" },
    { name: "Color & Accessibility Studio", desc: "Color picker, WCAG AA/AAA contrast checker, and interactive CSS gradient generator.", status: "completed", tag: "Design", href: "/color/converter" },
    { name: "Web & SEO Utilities", desc: "Robots.txt builder, Open Graph previewer, and multi-resolution favicon generator.", status: "completed", tag: "Web", href: "/web/og-preview" },
  ];

  const phase3Items: PhaseItem[] = [
    { name: "Client-Side WebAssembly OCR", desc: "Extract text from scanned PDFs, images, and invoices locally in browser via WebAssembly.", status: "completed", tag: "OCR / WASM", href: "/ocr/image" },
    { name: "AI Document Summarizer & Notes", desc: "Local executive summaries, reading metrics, study notes, and actionable takeaways.", status: "completed", tag: "AI", href: "/ai/summarize" },
    { name: "Chat with PDF & Study Flashcards", desc: "Interactive conversational document assistant and active recall 3D flashcard decks.", status: "completed", tag: "AI / Education", href: "/ai/chat" },
    { name: "Cryptographic PDF Redaction & E-Sign", desc: "Bitwise permanent redaction of sensitive text blocks and digital hand-drawn/calligraphy signatures.", status: "completed", tag: "Compliance", href: "/pdf/redact" },
    { name: "Business Invoices & Receipts Generator", desc: "Create customizable A4 invoices and printable thermal receipts directly in browser memory.", status: "completed", tag: "Business", href: "/business/invoice" },
    { name: "Speech Dictation & Text-to-Speech Engine", desc: "Realtime voice-to-text audio transcription and multi-voice speech synthesis.", status: "completed", tag: "Audio AI", href: "/ai/transcribe" },
    { name: "In-Browser Screen & Audio Recorder", desc: "Record monitor, window, or browser tab with system microphone audio directly to WebM/MP4.", status: "completed", tag: "Recording", href: "/misc/screen-record" },
    { name: "Markdown to PDF & TXT Stream Extractor", desc: "High-fidelity conversion between Markdown and styled A4 PDF documents with zero server file retention.", status: "completed", tag: "Conversion", href: "/convert/markdown-to-pdf" },
  ];

  return (
    <ToolShell
      title="trysomenew Roadmap & Architectural Phases"
      description="The engineering blueprint for trysomenew: from local-first client foundations to high-performance WebAssembly document computing."
      actions={
        <Link href="/tools" className="btn-primary flex items-center gap-1.5 text-xs py-2">
          <span>Explore All Live Tools</span>
          <ArrowRight size={14} />
        </Link>
      }
    >
      <div className="space-y-12">
        {/* PHASE 1 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">Phase 1: Core Client Foundations</h2>
                <p className="text-xs text-[var(--muted)]">Local-First PDF processing, cryptographic verification & ephemeral cross-device sync.</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={13} /> Completed & Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase1Items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl glass border border-[var(--card-border)] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">{item.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[var(--muted)]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                {item.href && (
                  <div className="pt-2">
                    <Link href={item.href} className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-medium">
                      <span>Launch tool</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PHASE 2 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">Phase 2: Developer & Productivity Expansion</h2>
                <p className="text-xs text-[var(--muted)]">Full developer utility suite, code formatters, image editing, SVG studio & SEO helpers.</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={13} /> Completed & Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase2Items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl glass border border-[var(--card-border)] space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">{item.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[var(--muted)]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                {item.href && (
                  <div className="pt-2">
                    <Link href={item.href} className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-medium">
                      <span>Launch tool</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PHASE 3 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                3
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                  Phase 3: WebAssembly, Local OCR & Advanced Intelligence
                  <Sparkles size={16} className="text-cyan-400" />
                </h2>
                <p className="text-xs text-[var(--muted)]">Heavy client compute, multi-threaded worker pipelines, local OCR, and offline PWA.</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={13} /> Completed & Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phase3Items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass border border-cyan-500/30 bg-cyan-500/5 shadow-sm space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                    {item.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[var(--muted)]">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">{item.desc}</p>
                {item.href && (
                  <div className="pt-2">
                    <Link href={item.href} className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold">
                      <span>Launch tool</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </ToolShell>
  );
}
