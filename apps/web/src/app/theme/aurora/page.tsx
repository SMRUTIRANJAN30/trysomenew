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
} from "lucide-react";

export default function AuroraThemePreviewPage() {
  const [isDark, setIsDark] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"css" | "tailwind">("tailwind");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    // Check current theme
    const theme = document.documentElement.getAttribute("data-theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setIsDark(theme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const PRIMARY_SCALE = [
    { step: "50", hex: "#EEF2FF", role: "Soft Hover / Subtly Tinted Background", darkText: true },
    { step: "100", hex: "#E0E7FF", role: "Light Glow & Chip Active State", darkText: true },
    { step: "200", hex: "#C7D2FE", role: "Borders & Focus Halos", darkText: true },
    { step: "300", hex: "#A5B4FC", role: "Disabled Elements & Secondary Dividers", darkText: true },
    { step: "400", hex: "#818CF8", role: "Dark Theme Primary Text / Highlights", darkText: false },
    { step: "500", hex: "#6366F1", role: "Main Brand Primary & Active Badges", darkText: false },
    { step: "600", hex: "#4F46E5", role: "Primary Interactive Buttons & Links", darkText: false },
    { step: "700", hex: "#4338CA", role: "Button Hover & Pressed States", darkText: false },
    { step: "800", hex: "#3730A3", role: "Deep Accents & Contrast Badges", darkText: false },
    { step: "900", hex: "#312E81", role: "Darkest Brand Shade", darkText: false },
  ];

  const CATEGORIES = [
    { id: "pdf", name: "PDF Tools", icon: FileText, hex: "#EF4444", soft: "#FEE2E2", count: "34 tools", sample: "Merge PDF, Compress, Split, Redact" },
    { id: "image", name: "Image Tools", icon: ImageIcon, hex: "#10B981", soft: "#D1FAE5", count: "28 tools", sample: "JPG to PNG, Resize, Crop, SVG Optimize" },
    { id: "video", name: "Video and Audio", icon: Film, hex: "#8B5CF6", soft: "#EDE9FE", count: "16 tools", sample: "Screen Recorder, Audio Transcribe, TTS" },
    { id: "text", name: "Text and Writing", icon: Type, hex: "#3B82F6", soft: "#DBEAFE", count: "22 tools", sample: "OCR to Text, AI Summarize, Diff Checker" },
    { id: "converters", name: "Converters", icon: RefreshCw, hex: "#F97316", soft: "#FFEDD5", count: "32 tools", sample: "Markdown to PDF, Word to PDF, QR Generator" },
    { id: "developer", name: "Developer Tools", icon: Code2, hex: "#475569", soft: "#E2E8F0", count: "24 tools", sample: "JSON Validator, JWT Debugger, SQL Format" },
    { id: "calculators", name: "Calculators", icon: Calculator, hex: "#14B8A6", soft: "#CCFBF1", count: "14 tools", sample: "EMI Calculator, Age, Percentage, Unit" },
    { id: "seo", name: "SEO and Web", icon: Globe, hex: "#EC4899", soft: "#FCE7F3", count: "12 tools", sample: "Meta Tag Preview, Robots.txt, Favicon" },
  ];

  const STATUS_ITEMS = [
    { label: "Success", hex: "#22C55E", bg: "#F0FDF4", darkBg: "rgba(34,197,94,0.15)", icon: CheckCircle2, message: "File converted successfully in 120ms (0 bytes uploaded to cloud)." },
    { label: "Warning", hex: "#F59E0B", bg: "#FFFBEB", darkBg: "rgba(245,158,11,0.15)", icon: AlertTriangle, message: "Large file detected (48MB). Processing may take a few seconds." },
    { label: "Error", hex: "#EF4444", bg: "#FEF2F2", darkBg: "rgba(239,68,68,0.15)", icon: AlertCircle, message: "Password protected PDF. Please unlock the file to proceed." },
    { label: "Info", hex: "#0EA5E9", bg: "#F0F9FF", darkBg: "rgba(14,165,233,0.15)", icon: Info, message: "100% in-browser client execution ensures complete document privacy." },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* Sticky Header with Subtle Glass Effect */}
      <header className="sticky top-0 z-50 h-16 header-glass px-4 md:px-8 transition-colors">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-[var(--text-heading)]">trysomenew</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#6366F1]/20 dark:text-[#818CF8]">
                  Aurora UI
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] hidden sm:block">Design System & Theme Showcase</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)] px-3 py-1.5 rounded-lg transition-colors hidden md:inline-flex"
            >
              Back to App
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[#6366F1] text-xs font-semibold shadow-sm transition-all"
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Radial Glow & Brand Gradient */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-[var(--bg-main)]">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none opacity-80" />
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Aurora Design System • Spec v1.0
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-[36px] md:text-[52px] leading-[1.1] text-[var(--text-heading)] tracking-[-0.02em] max-w-4xl mx-auto mb-6">
            Modern, Friendly &amp; Fast: <br className="hidden sm:inline" />
            <span className="text-brand-gradient">The Aurora UI System</span>
          </h1>

          <p className="text-[17px] md:text-[19px] leading-[1.6] text-[var(--text-main)] max-w-2xl mx-auto mb-10">
            A bespoke design language engineered specifically for 177+ online document tools. Generous whitespace,
            soft gradients, 18px rounded cards, and an unmistakable high-contrast orange CTA.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => copyToClipboard("#FF7A1A", "cta-hex")}
              className="btn-cta group"
            >
              <span>Main CTA (#FF7A1A)</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => copyToClipboard("#4F46E5", "pri-hex")}
              className="btn-primary"
            >
              <span>Primary Button (#4F46E5)</span>
            </button>

            <button
              onClick={() => copyToClipboard("#8B5CF6", "sec-hex")}
              className="btn-secondary-violet"
            >
              <span>Secondary (#8B5CF6)</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="btn-secondary"
            >
              <span>Open 24px Modal</span>
            </button>
          </div>

          {copiedKey && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] dark:bg-emerald-950/40 dark:text-[#34D399] text-xs font-semibold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Copied {copiedKey} to clipboard!
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-8 space-y-24 pb-28">
        {/* 1) Brand Colors: Primary Scale */}
        <section id="brand-colors" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
              <Sparkles className="w-4 h-4" />
              Section 1
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
              Brand Colours &amp; Indigo Scale
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              Indigo 500 (#6366F1) is the signature brand color, supported by Violet (#8B5CF6) and high-contrast Orange (#FF7A1A).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {PRIMARY_SCALE.map((p) => (
              <div
                key={p.step}
                onClick={() => copyToClipboard(p.hex, `p-${p.step}`)}
                className="cursor-pointer group flex flex-col rounded-xl overflow-hidden border border-[var(--border-card)] hover:border-[#6366F1] transition-all hover:scale-105 shadow-sm"
              >
                <div
                  className="h-16 w-full flex items-center justify-center font-mono font-bold text-xs"
                  style={{ backgroundColor: p.hex, color: p.darkText ? "#0F172A" : "#FFFFFF" }}
                >
                  {p.step}
                </div>
                <div className="p-2 bg-[var(--bg-card)] text-center">
                  <div className="text-[11px] font-mono font-semibold text-[var(--text-heading)]">{p.hex}</div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">{p.role.split(" ")[0]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Accent & Secondary Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Accent CTA */}
            <div className="p-6 rounded-[18px] border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A1A]">Accent / Main CTA</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">#FF7A1A</span>
              </div>
              <div className="h-20 rounded-xl bg-[#FF7A1A] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/25">
                Main Action CTA
              </div>
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <div className="flex justify-between"><span>Normal:</span> <code className="font-mono text-[var(--text-heading)]">#FF7A1A</code></div>
                <div className="flex justify-between"><span>Hover:</span> <code className="font-mono text-[var(--text-heading)]">#EA6A0C</code></div>
                <div className="flex justify-between"><span>Soft Background:</span> <code className="font-mono text-[var(--text-heading)]">#FFF1E6</code></div>
              </div>
            </div>

            {/* Secondary Violet */}
            <div className="p-6 rounded-[18px] border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Secondary Violet</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">#8B5CF6</span>
              </div>
              <div className="h-20 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                Secondary Accent
              </div>
              <div className="text-xs text-[var(--text-muted)] space-y-1">
                <div className="flex justify-between"><span>Normal:</span> <code className="font-mono text-[var(--text-heading)]">#8B5CF6</code></div>
                <div className="flex justify-between"><span>Hover:</span> <code className="font-mono text-[var(--text-heading)]">#7C3AED</code></div>
                <div className="flex justify-between"><span>Soft Background:</span> <code className="font-mono text-[var(--text-heading)]">#EDE9FE</code></div>
              </div>
            </div>

            {/* Brand Gradient */}
            <div className="p-6 rounded-[18px] border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EC4899]">Brand Gradient</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">135deg</span>
              </div>
              <div className="h-20 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/20">
                Indigo → Violet → Pink
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)
              </p>
            </div>
          </div>
        </section>

        {/* 2 & 3) Neutrals & Dark Mode Matrix */}
        <section id="neutrals" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
              <Sliders className="w-4 h-4" />
              Sections 2 &amp; 3
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
              Neutrals &amp; Dark Mode Specification
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              Engineered with deep contrast for comfortable daytime viewing and midnight-slate dark mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Light Mode Card */}
            <div className="p-8 rounded-[18px] border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span className="font-heading font-bold text-lg">Light Mode Palette</span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">Default</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Page Background:</span> <code className="font-mono text-[#0F172A]">#FFFFFF</code></div>
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Section Background:</span> <code className="font-mono text-[#0F172A]">#F8FAFC</code></div>
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Card Background:</span> <code className="font-mono text-[#0F172A]">#FFFFFF</code></div>
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Border (Normal / Strong):</span> <code className="font-mono text-[#0F172A]">#E2E8F0 / #CBD5E1</code></div>
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Heading Text:</span> <code className="font-mono text-[#0F172A]">#0F172A</code></div>
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]"><span>Body Text:</span> <code className="font-mono text-[#334155]">#334155</code></div>
                <div className="flex justify-between py-2"><span>Muted / Placeholder:</span> <code className="font-mono text-[#64748B]">#64748B / #94A3B8</code></div>
              </div>
            </div>

            {/* Dark Mode Card */}
            <div className="p-8 rounded-[18px] border border-[#243049] bg-[#0A0F1E] text-[#F8FAFC] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <span className="font-heading font-bold text-lg">Dark Mode Palette</span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-[#131B2E] border border-[#243049] text-[#94A3B8]">Class: dark</span>
              </div>
              <div className="space-y-2 text-sm text-[#CBD5E1]">
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Page Background:</span> <code className="font-mono text-[#F8FAFC]">#0A0F1E</code></div>
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Section Background:</span> <code className="font-mono text-[#F8FAFC]">#0F172A</code></div>
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Card Background / Hover:</span> <code className="font-mono text-[#F8FAFC]">#131B2E / #1A2440</code></div>
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Border:</span> <code className="font-mono text-[#F8FAFC]">#243049</code></div>
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Heading Text:</span> <code className="font-mono text-[#F8FAFC]">#F8FAFC</code></div>
                <div className="flex justify-between py-2 border-b border-[#1A2440]"><span>Primary in Dark:</span> <code className="font-mono text-[#818CF8]">#818CF8 (buttons keep #6366F1)</code></div>
                <div className="flex justify-between py-2"><span>Glow Shadow:</span> <code className="font-mono text-[#818CF8]">0 0 40px rgba(99,102,241,0.25)</code></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4) Status Colours */}
        <section id="status-colors" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
              <CheckCircle2 className="w-4 h-4" />
              Section 4
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
              Status Colours &amp; Alerts
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              Semantic indicators for user feedback, file processing results, and alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATUS_ITEMS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="p-5 rounded-[18px] border transition-all flex items-start gap-4"
                  style={{
                    backgroundColor: isDark ? s.darkBg : s.bg,
                    borderColor: `${s.hex}40`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${s.hex}25`, color: s.hex }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm" style={{ color: s.hex }}>
                        {s.label}
                      </span>
                      <code className="text-xs font-mono opacity-80">{s.hex}</code>
                    </div>
                    <p className="text-xs text-[var(--text-main)] leading-relaxed">{s.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5) Category Colours Matrix (All 8 Categories) */}
        <section id="category-colors" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
              <Sparkles className="w-4 h-4" />
              Section 5
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
              Category Colours (All 8 Tool Categories)
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              Every tool category has its distinct icon color and soft background tint for effortless visual scanning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="card-tool p-6 relative overflow-hidden group cursor-pointer"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: isDark ? `${cat.hex}25` : cat.soft,
                        color: cat.hex,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isDark ? `${cat.hex}20` : cat.soft,
                        color: cat.hex,
                      }}
                    >
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[var(--text-heading)] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4">
                    {cat.sample}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border-card)] text-[11px] font-mono">
                    <span style={{ color: cat.hex }}>{cat.hex}</span>
                    <span className="text-[var(--text-muted)]">{cat.soft}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6 & 7) Components, Geometry & Typography */}
        <section id="components" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
              <Code2 className="w-4 h-4" />
              Sections 6 &amp; 7
            </div>
            <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
              Typography, Shapes &amp; Components
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              Strict geometric tokens: 12px buttons, 14px inputs, 18px cards, 24px modals, and 999px pill chips.
            </p>
          </div>

          {/* Interactive Universal Dropzone Specimen */}
          <div className="p-8 rounded-[18px] border-2 border-dashed border-[var(--border-card)] hover:border-[#6366F1] bg-[var(--bg-section)] text-center transition-colors min-h-[280px] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] dark:bg-[#6366F1]/20 text-[#6366F1] flex items-center justify-center shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-heading font-bold text-[var(--text-heading)]">
                Universal Dropzone (280px Min Height)
              </h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md">
                Drop your files here, paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border text-[10px]">Ctrl+V</kbd>), or click to browse.
              </p>
            </div>

            <button className="btn-cta">
              <span>Choose Files (#FF7A1A)</span>
            </button>

            <span className="text-[11px] font-medium text-[var(--text-muted)]">
              🔒 100% Client-Side Processing • Zero Remote File Uploads
            </span>
          </div>

          {/* Buttons & Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Buttons Showcase */}
            <div className="p-6 rounded-[18px] border border-[var(--border-card)] bg-[var(--bg-card)] space-y-4">
              <h3 className="font-heading font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                <span>Button Scale (Radius: 12px)</span>
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-cta text-sm !h-11 !px-5">CTA 44px</button>
                <button className="btn-primary">Primary 42px</button>
                <button className="btn-secondary-violet">Violet 42px</button>
                <button className="btn-secondary">Outline 42px</button>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="aurora-chip bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-300">
                  Chip 999px
                </span>
                <span className="aurora-chip bg-[#FFF1E6] text-[#FF7A1A] dark:bg-orange-950/40 dark:text-orange-300">
                  CTA Chip
                </span>
                <span className="aurora-chip bg-[#EDE9FE] text-[#8B5CF6] dark:bg-purple-950/40 dark:text-purple-300">
                  Violet Chip
                </span>
                <span className="aurora-chip bg-[#D1FAE5] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-300">
                  Success Chip
                </span>
              </div>
            </div>

            {/* Inputs & Forms */}
            <div className="p-6 rounded-[18px] border border-[var(--border-card)] bg-[var(--bg-card)] space-y-4">
              <h3 className="font-heading font-bold text-base text-[var(--text-heading)]">
                Input Fields (Radius: 14px)
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Placeholder (#94A3B8)..."
                  className="w-full px-4 py-2.5 aurora-input text-sm"
                  readOnly
                  value="Merge PDF, Compress, JPG to PNG..."
                />
                <input
                  type="text"
                  placeholder="Type anything to test focus ring..."
                  className="w-full px-4 py-2.5 aurora-input text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Code & Tokens Deliverables */}
        <section id="deliverables" className="space-y-6">
          <div className="border-b border-[var(--border-card)] pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
                <Copy className="w-4 h-4" />
                Code Deliverables
              </div>
              <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[var(--text-heading)] mt-1">
                Ready-to-Use Tailwind Config &amp; CSS
              </h2>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)]">
              <button
                onClick={() => setActiveTab("tailwind")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "tailwind"
                    ? "bg-[#6366F1] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
              >
                tailwind.config.ts
              </button>
              <button
                onClick={() => setActiveTab("css")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "css"
                    ? "bg-[#6366F1] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
              >
                globals.css (:root)
              </button>
            </div>
          </div>

          <div className="relative rounded-[18px] border border-[var(--border-card)] bg-[#0A0F1E] text-slate-200 p-6 overflow-x-auto text-xs font-mono shadow-2xl">
            <button
              onClick={() => copyToClipboard(activeTab === "tailwind" ? TAILWIND_CODE : CSS_CODE, "code")}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
            >
              {copiedKey === "code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === "code" ? "Copied" : "Copy Code"}</span>
            </button>

            <pre className="overflow-x-auto">
              {activeTab === "tailwind" ? TAILWIND_CODE : CSS_CODE}
            </pre>
          </div>
        </section>
      </main>

      {/* 24px Modal Dialog Specimen */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="aurora-modal p-8 max-w-lg w-full relative space-y-5 animate-scale-up">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--bg-section)] text-[var(--text-muted)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#FF7A1A] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-extrabold text-[var(--text-heading)]">
                Aurora Modal Dialog
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Conforms to Section 7 shape guidelines: 24px radius (`rounded-[24px]`), subtle elevation shadow, and soft backdrop blur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)] space-y-2 text-xs">
              <div className="flex justify-between font-mono"><span>Border Radius:</span> <code>24px</code></div>
              <div className="flex justify-between font-mono"><span>Primary Action:</span> <code>#FF7A1A Orange CTA</code></div>
              <div className="flex justify-between font-mono"><span>Secondary Action:</span> <code>12px Radius Button</code></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => setModalOpen(false)} className="btn-cta !h-11 !px-5 text-sm">
                Confirm &amp; Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TAILWIND_CODE = `// tailwind.config.ts (Aurora Design System)
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        aurora: {
          50: "#EEF2FF", 100: "#E0E7FF", 200: "#C7D2FE", 300: "#A5B4FC",
          400: "#818CF8", 500: "#6366F1", 600: "#4F46E5", 700: "#4338CA",
          800: "#3730A3", 900: "#312E81",
        },
        secondary: { DEFAULT: "#8B5CF6", hover: "#7C3AED" },
        accent: { DEFAULT: "#FF7A1A", hover: "#EA6A0C", soft: "#FFF1E6" },
        neutral: {
          light: { page: "#FFFFFF", section: "#F8FAFC", card: "#FFFFFF", border: "#E2E8F0" },
          dark: { page: "#0A0F1E", section: "#0F172A", card: "#131B2E", border: "#243049" }
        },
        category: {
          pdf: { icon: "#EF4444", soft: "#FEE2E2" },
          image: { icon: "#10B981", soft: "#D1FAE5" },
          video: { icon: "#8B5CF6", soft: "#EDE9FE" },
          text: { icon: "#3B82F6", soft: "#DBEAFE" },
          converters: { icon: "#F97316", soft: "#FFEDD5" },
          developer: { icon: "#475569", soft: "#E2E8F0" },
          calculators: { icon: "#14B8A6", soft: "#CCFBF1" },
          seo: { icon: "#EC4899", soft: "#FCE7F3" },
        }
      },
      borderRadius: { button: "12px", input: "14px", card: "18px", modal: "24px", chip: "999px" },
      boxShadow: {
        "aurora-sm": "0 1px 2px rgba(15,23,42,0.06)",
        "aurora-card-hover": "0 12px 30px rgba(99,102,241,0.15)",
        "aurora-glow": "0 0 40px rgba(99,102,241,0.25)",
      }
    }
  }
} satisfies Config;`;

const CSS_CODE = `/* globals.css - Aurora Design Tokens */
:root {
  --primary-50: #EEF2FF;
  --primary-500: #6366F1;
  --primary-600: #4F46E5;
  --primary-700: #4338CA;
  --secondary: #8B5CF6;
  --accent-cta: #FF7A1A;
  --accent-cta-hover: #EA6A0C;
  --accent-cta-soft: #FFF1E6;
  --brand-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
  --hero-glow: radial-gradient(circle at 50% 0%, #E0E7FF 0%, transparent 60%);

  /* Neutrals (Light Mode) */
  --bg-main: #FFFFFF;
  --bg-section: #F8FAFC;
  --bg-card: #FFFFFF;
  --border-card: #E2E8F0;
  --text-heading: #0F172A;
  --text-main: #334155;
  --text-muted: #64748B;

  /* Shapes */
  --radius-button: 12px;
  --radius-input: 14px;
  --radius-card: 18px;
  --radius-modal: 24px;
}

[data-theme="dark"], .dark {
  --bg-main: #0A0F1E;
  --bg-section: #0F172A;
  --bg-card: #131B2E;
  --border-card: #243049;
  --text-heading: #F8FAFC;
  --text-main: #CBD5E1;
  --shadow-glow: 0 0 40px rgba(99,102,241,0.25);
}`;
