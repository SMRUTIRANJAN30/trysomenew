"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  Layers,
  Star,
  History,
  Settings,
  Search,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Trash2,
  HardDrive,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { TOOLS, ToolDefinition } from "@/lib/toolsData";
import { ToolCard } from "@/components/common/ToolCard";
import { formatBytes } from "@/lib/utils";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<"home" | "favorites" | "history" | "settings">("home");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<ToolDefinition[]>([]);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      try {
        const raw = localStorage.getItem("trysomenew_favorites");
        if (raw) {
          setFavoriteIds(JSON.parse(raw));
        } else {
          // Default initial favorites
          setFavoriteIds(["merge-pdf", "image-to-pdf", "ocr-image", "compress-pdf"]);
        }
      } catch {}
    };

    loadFavorites();
    window.addEventListener("favorites-updated", loadFavorites);

    // Initial recent tools
    setRecentTools(TOOLS.filter((t) => t.isPopular && t.status === "ready").slice(0, 4));

    return () => window.removeEventListener("favorites-updated", loadFavorites);
  }, []);

  const favoriteTools = TOOLS.filter((t) => favoriteIds.includes(t.id) && t.status === "ready");

  const recentFiles = [
    { name: "Annual_Report_2026.pdf", tool: "Merge PDF", size: 4200000, date: "Today, 08:15 AM" },
    { name: "Receipt_Scan_March.png", tool: "Image OCR", size: 1850000, date: "Yesterday, 04:30 PM" },
    { name: "Project_Proposal.docx.pdf", tool: "Compress PDF", size: 8400000, date: "02 Apr 2026" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--bg-section)] flex flex-col md:flex-row">
      {/* 1. LEFT SIDEBAR (240px width) */}
      <aside className="w-full md:w-60 bg-[var(--bg-card)] border-r border-[var(--border-card)] p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="px-3 py-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Workspace Hub
            </h2>
          </div>

          <nav className="space-y-1 text-sm font-semibold">
            <button
              onClick={() => setActiveNav("home")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeNav === "home"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>

            <Link
              href="/tools"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Layers size={18} />
              <span>All 177+ Tools</span>
            </Link>

            <button
              onClick={() => setActiveNav("favorites")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeNav === "favorites"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Star size={18} />
                <span>Favorites</span>
              </div>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded-full bg-white/20">
                {favoriteTools.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav("history")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeNav === "history"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <History size={18} />
              <span>File History</span>
            </button>

            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                activeNav === "settings"
                  ? "bg-[#4F46E5] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Storage & Privacy Info */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)] space-y-2 mt-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={16} />
            <span>Zero Server Footprint</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            All files are held only in local browser memory and discarded upon tab close.
          </p>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        {/* Top Quick Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-card)] pb-6">
          <div className="space-y-1 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Welcome back to your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Instant access to your favorite utilities and recent client executions.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter dashboard tools..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        {/* 3. CLEAN STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Files Processed</span>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">14 Documents</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% In-Browser</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Bandwidth Saved</span>
            <div className="text-2xl font-extrabold text-[var(--text-main)]">148.5 MB</div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Zero server uploads</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Starred Favorites</span>
            <div className="text-2xl font-extrabold text-[#4F46E5]">{favoriteTools.length} Tools</div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Quick launch ready</span>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2 shadow-xs">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Privacy Status</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Secured</div>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">Local-first sandbox</span>
          </div>
        </div>

        {/* 4. FAVORITES TOOLS SECTION */}
        {(activeNav === "home" || activeNav === "favorites") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <h2 className="text-lg font-bold text-[var(--text-main)]">Your Favorited Tools</h2>
              </div>
              <Link href="/tools" className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1">
                <span>Add more</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {favoriteTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favoriteTools
                  .filter((t) => t.name.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((tool) => (
                    <ToolCard key={tool.id} tool={tool} isFavorited={true} />
                  ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2">
                <Star size={24} className="mx-auto text-[var(--text-muted)] opacity-40" />
                <p className="text-sm font-semibold text-[var(--text-main)]">No favorites starred yet</p>
                <p className="text-xs text-[var(--text-muted)]">
                  Click the star icon on any tool card across the website to pin it here.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 5. RECENT TOOLS SECTION */}
        {activeNav === "home" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#4F46E5]" />
                <h2 className="text-lg font-bold text-[var(--text-main)]">Recently Recommended Tools</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* 6. RECENT FILES LIST */}
        {(activeNav === "home" || activeNav === "history") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} className="text-indigo-500" />
                <h2 className="text-lg font-bold text-[var(--text-main)]">Recent Session Files</h2>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] divide-y divide-[var(--border-card)] overflow-hidden shadow-xs">
              {recentFiles.map((file, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--text-main)] truncate">{file.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {file.tool} • {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[var(--text-muted)] shrink-0">
                    <span className="hidden sm:inline text-[11px]">{file.date}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Processed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
