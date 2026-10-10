"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Check,
  Copy,
  ArrowRight,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Film,
  Type,
  RefreshCw,
  Code2,
  Calculator,
  Globe,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Sliders,
  X,
  ExternalLink,
  Laptop,
  Radio,
  QrCode,
  Layers,
  Wrench,
  ShieldCheck,
} from "lucide-react";

export default function ToolbenchThemePreviewPage() {
  const [isDark, setIsDark] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"css" | "tailwind">("css");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const theme =
      document.documentElement.getAttribute("data-theme") ||
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setIsDark(theme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("trysomenew-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("trysomenew-theme", "light");
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const PAPER_PALETTE = [
    { name: "Paper (bg-main)", hex: "#FAF7F0", darkHex: "#0F0E0C", role: "Primary page background", darkText: true },
    { name: "Paper Dark (bg-section)", hex: "#F1EDE2", darkHex: "#171513", role: "Section & workbench tray background", darkText: true },
    { name: "Ink (text & border)", hex: "#14110F", darkHex: "#F3EFE4", role: "Headers, body text & 2px border strokes", darkText: false },
    { name: "Muted Ink", hex: "#5C564E", darkHex: "#A9A296", role: "Subtitles, metadata, timestamps", darkText: false },
    { name: "White (card surface)", hex: "#FFFFFF", darkHex: "#1A1815", role: "Module cards & active inputs", darkText: true },
  ];

  const ACCENTS = [
    { name: "Lime (Main CTA)", hex: "#C8F135", hover: "#B8E020", role: "High-contrast action button (always dark text)", textColor: "#14110F" },
    { name: "Cobalt", hex: "#2B4DFF", hover: "#1A3DE6", role: "Interactive links, info badges, tech tags", textColor: "#FFFFFF" },
    { name: "Coral", hex: "#FF5A3C", hover: "#E84A2C", role: "PDF category, errors, destructive alerts", textColor: "#FFFFFF" },
    { name: "Mint", hex: "#2ED47A", hover: "#24B868", role: "Image category, success states, security", textColor: "#14110F" },
    { name: "Sun", hex: "#FFC933", hover: "#E6B52E", role: "Converters, warnings, highlighted features", textColor: "#14110F" },
    { name: "Lilac", hex: "#B9A6FF", hover: "#A08FE6", role: "Video & audio, special modules", textColor: "#14110F" },
  ];

  const CATEGORIES = [
    { id: "pdf", name: "PDF Tools", icon: FileText, hex: "#FF5A3C", bgTint: "#FFD9D2", count: "34 tools", sample: "Merge PDF, Compress, Split, Redact" },
    { id: "image", name: "Image Tools", icon: ImageIcon, hex: "#2ED47A", bgTint: "#D8F5E3", count: "28 tools", sample: "JPG to PNG, Resize, Crop, SVG Optimize" },
    { id: "video", name: "Video & Audio", icon: Film, hex: "#B9A6FF", bgTint: "#E6DFFF", count: "16 tools", sample: "Screen Recorder, Audio Transcribe, TTS" },
    { id: "text", name: "Text & Writing", icon: Type, hex: "#2B4DFF", bgTint: "#D9E3FF", count: "22 tools", sample: "OCR to Text, AI Summarize, Diff Checker" },
    { id: "converters", name: "Converters", icon: RefreshCw, hex: "#FFC933", bgTint: "#FFE9C2", count: "32 tools", sample: "Markdown to PDF, Word to PDF, QR Generator" },
    { id: "developer", name: "Developer Tools", icon: Code2, hex: "#5C564E", bgTint: "#E4E0D6", count: "24 tools", sample: "JSON Validator, JWT Debugger, SQL Format" },
    { id: "calculators", name: "Calculators", icon: Calculator, hex: "#14B8A6", bgTint: "#CFF3EE", count: "14 tools", sample: "EMI Calculator, Age, Percentage, Unit" },
    { id: "seo", name: "SEO & Web", icon: Globe, hex: "#EC4899", bgTint: "#FFD6EC", count: "12 tools", sample: "Meta Tag Preview, Robots.txt, Favicon" },
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] bg-dotted-grid transition-colors duration-150">
      {/* Neo-brutalist Header Bar */}
      <header className="sticky top-0 z-50 h-16 bg-[var(--paper)] border-b-2 border-[var(--ink)] px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold font-heading text-[var(--ink)] tracking-tight hover:no-underline"
            >
              <span className="w-8 h-8 rounded-lg bg-[var(--lime)] border-2 border-[var(--ink)] flex items-center justify-center font-black text-sm shadow-[2px_2px_0_var(--ink)]">
                TB
              </span>
              <span>TOOLBENCH</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-bold font-mono uppercase bg-[var(--lime)] border-2 border-[var(--ink)] rounded-full shadow-[1px_1px_0_var(--ink)]">
              Neo-Brutalist v2.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/beam"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 bg-[var(--paper-dark)] border-2 border-[var(--ink)] rounded-lg hover:bg-[var(--lime)] transition-colors shadow-[2px_2px_0_var(--ink)] hover:no-underline text-[var(--ink)]"
            >
              <Radio className="w-4 h-4" /> Beam Feature
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border-2 border-[var(--ink)] bg-[var(--bg-card)] hover:bg-[var(--paper-dark)] text-[var(--ink)] transition-colors shadow-[2px_2px_0_var(--ink)]"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-[var(--lime)]" /> : <Moon className="w-5 h-5 text-[var(--ink)]" />}
            </button>
            <Link
              href="/"
              className="btn-cta text-sm py-2 px-4 hover:no-underline"
            >
              Back to Tools
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--lime)] text-[var(--ink)] border-2 border-[var(--ink)] rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-6 shadow-[2px_2px_0_var(--ink)]">
            <Wrench className="w-3.5 h-3.5" /> Digital Workbench Concept
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-[var(--ink)] mb-6 tracking-tight leading-[1.05]">
            TOOLBENCH<br />
            <span className="inline-block px-3 py-1 bg-[var(--lime)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)] mt-2">
              Design System
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--ink-muted)] max-w-3xl mb-8 leading-relaxed">
            A bold neo-brutalist UI architecture for 177+ browser-based tools. 
            Thick 2px ink outlines, offset drop shadows, sticker-like category modules, 
            and zero heavy gradients or stock fluff. Built for speed, clarity, and instant user utility.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#workbench-preview" className="btn-cta hover:no-underline">
              <span>Inspect Workbench Modules</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setModalOpen(true)}
              className="btn-secondary"
            >
              <span>Test Modal System</span>
            </button>
            <Link
              href="/beam"
              className="btn-cobalt hover:no-underline"
            >
              <Radio className="w-4 h-4" /> Try Beam Live Sync
            </Link>
          </div>
        </div>
      </section>

      {/* Core Rules Grid */}
      <section className="py-12 px-4 md:px-8 bg-[var(--paper-dark)] border-b-2 border-[var(--ink)]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="tb-card p-6 bg-[var(--white)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--lime)] border-2 border-[var(--ink)] flex items-center justify-center font-bold text-lg mb-4 shadow-[2px_2px_0_var(--ink)]">
              01
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Thick 2px Ink Borders</h3>
            <p className="text-sm text-[var(--ink-muted)]">
              Every card, button, and input carries a distinct 2px solid stroke with crisp corners and tangible geometry.
            </p>
          </div>

          <div className="tb-card p-6 bg-[var(--white)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--coral)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-lg mb-4 shadow-[2px_2px_0_var(--ink)]">
              02
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">4px Offset Shadow</h3>
            <p className="text-sm text-[var(--ink-muted)]">
              No fuzzy drop shadows. Crisp hard offset shadows (<code className="font-mono text-xs">4px 4px 0 #14110F</code>) that elevate on hover and collapse on click.
            </p>
          </div>

          <div className="tb-card p-6 bg-[var(--white)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--cobalt)] text-white border-2 border-[var(--ink)] flex items-center justify-center font-bold text-lg mb-4 shadow-[2px_2px_0_var(--ink)]">
              03
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Lime High-Contrast CTA</h3>
            <p className="text-sm text-[var(--ink-muted)]">
              Primary calls-to-action utilize electric Lime (<code className="font-mono text-xs">#C8F135</code>) with high-contrast dark ink typography for instant discoverability.
            </p>
          </div>
        </div>
      </section>

      {/* Palette Section */}
      <section className="py-16 px-4 md:px-8 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold font-heading mb-2">Paper & Ink Foundation</h2>
        <p className="text-[var(--ink-muted)] mb-8">
          The tactile canvas built on warm paper hues and sharp ink contrasts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {PAPER_PALETTE.map((p) => (
            <div
              key={p.name}
              className="tb-card p-4 flex flex-col justify-between"
              style={{ backgroundColor: isDark ? p.darkHex : p.hex }}
            >
              <div>
                <div
                  className="text-xs font-mono font-bold uppercase mb-1"
                  style={{ color: isDark ? "#F3EFE4" : (p.darkText ? "#14110F" : "#F3EFE4") }}
                >
                  {p.name}
                </div>
                <div
                  className="text-xs opacity-75 font-mono mb-4"
                  style={{ color: isDark ? "#A9A296" : (p.darkText ? "#5C564E" : "#E4E0D6") }}
                >
                  {isDark ? p.darkHex : p.hex}
                </div>
              </div>
              <p
                className="text-xs leading-tight"
                style={{ color: isDark ? "#F3EFE4" : (p.darkText ? "#14110F" : "#F3EFE4") }}
              >
                {p.role}
              </p>
            </div>
          ))}
        </div>

        {/* Accent Colors */}
        <h2 className="text-3xl font-bold font-heading mb-2">Vibrant Accent Palette</h2>
        <p className="text-[var(--ink-muted)] mb-8">
          Function-driven color tokens for category identification, states, and interactive feedback.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {ACCENTS.map((acc) => (
            <div
              key={acc.name}
              className="tb-card p-4 flex flex-col justify-between"
              style={{ backgroundColor: acc.hex, color: acc.textColor }}
            >
              <div>
                <div className="font-bold font-heading text-sm mb-1">{acc.name}</div>
                <div className="text-xs font-mono opacity-80 mb-3">{acc.hex}</div>
              </div>
              <p className="text-xs font-medium leading-snug">{acc.role}</p>
            </div>
          ))}
        </div>

        {/* Category Themed Cards */}
        <h2 className="text-3xl font-bold font-heading mb-2">Category Module Themes</h2>
        <p className="text-[var(--ink-muted)] mb-8">
          Sticker-like module cards with dedicated background tints and 2px ink outlines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="tb-card p-5 cursor-pointer"
                style={{ backgroundColor: isDark ? "var(--bg-card)" : cat.bgTint }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-[var(--ink)] flex items-center justify-center shadow-[2px_2px_0_var(--ink)]"
                    style={{ backgroundColor: cat.hex, color: "#FFFFFF" }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="tb-chip text-xs bg-[var(--white)] text-[var(--ink)]">
                    {cat.count}
                  </span>
                </div>
                <h3 className="font-bold font-heading text-lg text-[var(--ink)] mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mb-4">
                  {cat.sample}
                </p>
                <div className="flex items-center text-xs font-bold text-[var(--ink)] gap-1 pt-2 border-t-2 border-[var(--ink)]/20">
                  <span>Open workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Interactive Workbench Module Demo */}
        <div id="workbench-preview" className="tb-card p-6 md:p-10 bg-[var(--white)] mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-[var(--ink)]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[var(--coral)] text-white border-2 border-[var(--ink)] mb-2 shadow-[2px_2px_0_var(--ink)]">
                <FileText className="w-3.5 h-3.5" /> PDF Module
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-heading">
                Merge PDF Documents
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="tb-chip bg-[var(--lime)] text-[var(--ink)]">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
              </span>
              <span className="tb-chip bg-[var(--paper-dark)] text-[var(--ink)]">
                0 Bytes Uploaded
              </span>
            </div>
          </div>

          {/* Interactive Drag & Drop Area */}
          <div className="border-2 border-dashed border-[var(--ink)] rounded-xl p-8 md:p-12 text-center bg-[var(--paper)] hover:bg-[var(--paper-dark)] transition-colors cursor-pointer mb-6">
            <div className="w-16 h-16 rounded-xl bg-[var(--lime)] border-2 border-[var(--ink)] mx-auto flex items-center justify-center shadow-[4px_4px_0_var(--ink)] mb-4">
              <UploadCloud className="w-8 h-8 text-[var(--ink)]" />
            </div>
            <h4 className="text-lg font-bold font-heading mb-1">
              Drop PDF files here or click to browse
            </h4>
            <p className="text-sm text-[var(--ink-muted)] mb-4">
              Fast multi-file reordering, page extraction, and instant lossless compilation.
            </p>
            <button className="btn-cta text-sm">
              <span>Choose Files from Device</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[var(--ink)]">
            <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm">
                <span>Clear Queue</span>
              </button>
              <button className="btn-secondary text-sm">
                <span>Add More</span>
              </button>
            </div>
            <button className="btn-cta">
              <Sparkles className="w-4 h-4" />
              <span>Merge & Download PDF</span>
            </button>
          </div>
        </div>

        {/* Code Snippets & Design Tokens */}
        <h2 className="text-3xl font-bold font-heading mb-2">CSS Tokens & Integration</h2>
        <p className="text-[var(--ink-muted)] mb-6">
          Ready-to-use variables and Tailwind utilities powering the Toolbench theme.
        </p>

        <div className="tb-card bg-[var(--ink)] text-[#F3EFE4] p-6 mb-16 overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F3EFE4]/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("css")}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-[var(--ink)] transition-colors ${
                  activeTab === "css"
                    ? "bg-[var(--lime)] text-[#14110F]"
                    : "bg-[#1A1815] text-[#F3EFE4]"
                }`}
              >
                globals.css Tokens
              </button>
              <button
                onClick={() => setActiveTab("tailwind")}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border-2 border-[var(--ink)] transition-colors ${
                  activeTab === "tailwind"
                    ? "bg-[var(--lime)] text-[#14110F]"
                    : "bg-[#1A1815] text-[#F3EFE4]"
                }`}
              >
                Tailwind Config Classes
              </button>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  activeTab === "css"
                    ? `:root {
  --paper: #FAF7F0;
  --paper-dark: #F1EDE2;
  --ink: #14110F;
  --lime: #C8F135;
  --shadow-offset: 4px 4px 0 #14110F;
}`
                    : `// Toolbench Classes
.tb-card { border: 2px solid #14110F; box-shadow: 4px 4px 0 #14110F; }
.btn-cta { background: #C8F135; color: #14110F; border: 2px solid #14110F; }`,
                  "code"
                )
              }
              className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 bg-[#1A1815] hover:bg-[var(--lime)] hover:text-[#14110F] border border-[#F3EFE4]/30 rounded-lg transition-colors"
            >
              {copiedKey === "code" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === "code" ? "Copied" : "Copy Code"}
            </button>
          </div>

          <pre className="font-mono text-xs sm:text-sm overflow-x-auto p-2 leading-relaxed text-[#D4F84E]">
            {activeTab === "css"
              ? `:root {
  /* Paper Palette */
  --paper:            #FAF7F0;
  --paper-dark:       #F1EDE2;
  --ink:              #14110F;
  --ink-muted:        #5C564E;
  
  /* Primary Lime & Accents */
  --lime:             #C8F135;
  --lime-hover:       #B8E020;
  --cobalt:           #2B4DFF;
  --coral:            #FF5A3C;
  --mint:             #2ED47A;
  --sun:              #FFC933;

  /* Offset Shadow System */
  --shadow-offset:    4px 4px 0 var(--ink);
  --shadow-offset-hover: 6px 6px 0 var(--ink);
  --shadow-offset-press: 0px 0px 0 var(--ink);
  --border-width:     2px;
}`
              : `/* Neo-brutalist utility classes */
.tb-card {
  background: var(--bg-card);
  border: 2px solid var(--border-card);
  border-radius: 14px;
  box-shadow: var(--shadow-offset);
}

.btn-cta {
  background: var(--lime);
  color: #14110F;
  font-weight: 700;
  border: 2px solid var(--ink);
  border-radius: 10px;
  box-shadow: var(--shadow-offset);
}`}
          </pre>
        </div>
      </section>

      {/* Interactive Modal System Test */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-none">
          <div className="tb-modal max-w-lg w-full p-6 sm:p-8 bg-[var(--white)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[var(--ink)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--lime)] border-2 border-[var(--ink)] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[var(--ink)]" />
                </div>
                <h3 className="text-xl font-bold font-heading">Toolbench Modal</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg border-2 border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--coral)] hover:text-white transition-colors shadow-[2px_2px_0_var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[var(--ink-muted)] mb-6">
              Neo-brutalist dialogs feature an 18px radius, 2px ink border, and deep 8px offset shadow with zero backdrop blur.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[var(--ink)]">
              <button
                onClick={() => setModalOpen(false)}
                className="btn-secondary text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-cta text-sm"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
