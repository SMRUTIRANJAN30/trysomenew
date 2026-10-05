"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, CheckCircle2, Clock, Zap, Star, Filter, X, FileType, Sparkles } from "lucide-react";
import {
  TOOLS,
  CATEGORY_LABELS,
  ToolDefinition,
  COMMON_EXTENSIONS,
  detectExtensionQuery,
} from "@/lib/toolsData";
import { DynamicIcon } from "@/components/common/DynamicIcon";

const CATEGORY_ORDER = [
  "pdf", "pdf-convert", "pdf-edit", "pdf-security", "pdf-organize",
  "watermark-stamp", "signature-verify", "ocr-scan",
  "ai-document", "ai-general", "ai-audio", "ai-video",
  "image", "color", "svg",
  "audio", "video", "gif", "media-download",
  "archive", "developer", "web", "text",
  "calculator", "qr", "barcode",
  "clipboard", "transfer", "device",
  "security-privacy", "workflow", "cloud",
  "business", "education", "print", "misc",
];

const POPULAR_CATEGORIES = [
  { id: "all", label: "All Categories", emoji: "🔧" },
  { id: "pdf", label: "PDF", emoji: "📄" },
  { id: "pdf-convert", label: "Convert", emoji: "🔄" },
  { id: "developer", label: "Developer", emoji: "💻" },
  { id: "image", label: "Image", emoji: "🖼️" },
  { id: "text", label: "Text", emoji: "📝" },
  { id: "color", label: "Color", emoji: "🎨" },
  { id: "qr", label: "QR", emoji: "📱" },
  { id: "barcode", label: "Barcode", emoji: "〓" },
  { id: "calculator", label: "Calculator", emoji: "🧮" },
  { id: "archive", label: "Archive", emoji: "📦" },
  { id: "security-privacy", label: "Security", emoji: "🔒" },
  { id: "audio", label: "Audio", emoji: "🎵" },
  { id: "video", label: "Video", emoji: "🎬" },
];

import { ToolCard } from "@/components/common/ToolCard";

export default function ToolsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedExtension, setSelectedExtension] = useState<string | null>(null);
  const [liveOnly, setLiveOnly] = useState(false);

  // Detect if user typed an extension into the search input
  const detectedExtFromSearch = useMemo(() => {
    return detectExtensionQuery(search);
  }, [search]);

  // The active strict extension filter
  const activeExtension = selectedExtension || detectedExtFromSearch;

  const totalLive = TOOLS.filter(t => t.status === "ready").length;
  const totalTools = TOOLS.length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return TOOLS.filter(t => {
      // 0. Live Only Filter (hide coming soon if user just wants working tools)
      if (liveOnly && t.status !== "ready") return false;

      // 1. Category Filter
      const matchCat = category === "all" || t.category === category;
      if (!matchCat) return false;

      // 2. Strict Extension Filter
      if (activeExtension) {
        const ext = activeExtension.toLowerCase();
        const supportsInput = t.inputExtensions?.some(e => e.toLowerCase() === ext || e === "*");
        const supportsOutput = t.outputExtensions?.some(e => e.toLowerCase() === ext || e === "*");
        const supportsExt = supportsInput || supportsOutput;

        if (!supportsExt) return false;

        // If user typed more words with extension
        if (q && q !== ext && q !== `.${ext}`) {
          const words = q.split(/\s+/).filter(w => w !== ext && w !== `.${ext}`);
          const matchRemainingWords = words.every(word =>
            t.name.toLowerCase().includes(word) ||
            t.description.toLowerCase().includes(word) ||
            t.tags.some(tag => tag.includes(word))
          );
          return matchRemainingWords;
        }

        return true;
      }

      // 3. Regular Text Search
      if (!q) return true;

      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q))
      );
    });
  }, [search, category, activeExtension, liveOnly]);

  // Group by category for display
  const grouped = useMemo(() => {
    if (search.trim() || activeExtension) return null;
    const map = new Map<string, ToolDefinition[]>();
    for (const t of filtered) {
      const cat = t.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(t);
    }
    return CATEGORY_ORDER.filter(c => map.has(c)).map(c => ({ cat: c, tools: map.get(c)! }));
  }, [filtered, search, activeExtension]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedExtension(null);
    setCategory("all");
    setLiveOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-500 font-semibold mb-1">
          <Zap size={13} />
          {totalLive} Ready-to-Use Local Tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)] tracking-tight">
          Tools Directory
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto">
          Ultrafast document engineering tools running 100% locally in your browser. Zero cloud uploads.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (selectedExtension) setSelectedExtension(null);
          }}
          placeholder="Search format or tool name... (e.g. 'png', 'pdf', 'docx', 'xlsx', 'hash', 'a4')"
          className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-12 pr-10 py-3.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-sm"
        />
        {(search || selectedExtension) && (
          <button
            onClick={handleClearFilters}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            title="Clear filters"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls Bar: Live-Only Switch & Strict File Extension Filter */}
      <div className="max-w-4xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status View Toggle: All vs Live Only */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setLiveOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !liveOnly
                  ? "bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All Tools ({totalTools})
            </button>
            <button
              type="button"
              onClick={() => setLiveOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                liveOnly
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-emerald-600 dark:text-emerald-400 hover:text-[var(--foreground)]"
              }`}
            >
              <CheckCircle2 size={12} />
              Live Ready ({totalLive})
            </button>
          </div>

          {activeExtension && (
            <button
              onClick={() => { setSelectedExtension(null); setSearch(""); }}
              className="text-blue-500 hover:underline text-xs flex items-center gap-1 font-medium"
            >
              Reset Extension Filter
            </button>
          )}
        </div>

        {/* Extension Filter Chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            type="button"
            onClick={() => { setSelectedExtension(null); if (detectedExtFromSearch) setSearch(""); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              !activeExtension
                ? "bg-[var(--foreground)] text-[var(--background)] border-transparent font-semibold shadow-sm"
                : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All Formats
          </button>

          {COMMON_EXTENSIONS.map(item => {
            const isSelected = activeExtension === item.ext;
            return (
              <button
                key={item.ext}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedExtension(null);
                    setSearch("");
                  } else {
                    setSelectedExtension(item.ext);
                    setSearch("");
                  }
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                    : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--foreground)] hover:border-blue-500/40"
                }`}
              >
                <span>{item.icon}</span>
                <span>.{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Strict Extension Filter Notification Banner */}
      {activeExtension && (
        <div className="max-w-4xl mx-auto p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-600 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>
              Strictly showing tools supporting <strong>.{activeExtension.toUpperCase()}</strong> files ({filtered.length} {filtered.length === 1 ? "tool" : "tools"} found).
              Non-{activeExtension.toUpperCase()} tools (such as unrelated PDF tools) are hidden.
            </span>
          </div>
          <button
            onClick={() => { setSelectedExtension(null); setSearch(""); }}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Clear extension filter"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-all ${
                category === c.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
              {category === c.id && (
                <span className="text-[10px] bg-white/20 rounded-full px-1.5 py-0.2 ml-0.5 font-bold">
                  {c.id === "all" ? filtered.length : filtered.filter(t => t.category === c.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs text-[var(--muted-text)]">
        <span>
          Showing <strong className="text-[var(--foreground)]">{filtered.length}</strong> tools
          {category !== "all" ? ` in ${CATEGORY_LABELS[category] || category}` : ""}
          {activeExtension ? ` for .${activeExtension.toUpperCase()}` : (search ? ` matching "${search}"` : "")}
          {liveOnly ? " (Live only)" : ""}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 size={11} /> {filtered.filter(t => t.status === "ready").length} Live
          </span>
          {!liveOnly && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {filtered.filter(t => t.status === "coming_soon").length} Soon
            </span>
          )}
        </div>
      </div>

      {/* Tool Grid */}
      {search.trim() || activeExtension || !grouped ? (
        // Flat grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      ) : (
        // Grouped by category
        <div className="space-y-10">
          {grouped?.map(({ cat, tools }) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  {CATEGORY_LABELS[cat] || cat}
                </h2>
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                <span className="text-xs text-[var(--muted-text)]">{tools.filter(t => t.status === "ready").length}/{tools.length} live</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {tools.map(t => <ToolCard key={t.id} tool={t} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 space-y-3 glass rounded-3xl p-10 max-w-lg mx-auto">
          <div className="text-4xl">🔍</div>
          <p className="text-[var(--muted)] text-sm">
            No tools found for{" "}
            <strong className="text-[var(--foreground)]">
              {activeExtension ? `.${activeExtension.toUpperCase()}` : search}
            </strong>
          </p>
          <button onClick={handleClearFilters} className="btn-primary text-xs cursor-pointer">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
