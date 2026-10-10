"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Grid,
  Star,
  Clock,
  Radio,
  FileText,
  Settings,
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap,
  HardDrive,
  BarChart2,
  Menu,
} from "lucide-react";
import { TOOLS_CONFIG, ToolConfig } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Drawer } from "@/components/ui/Drawer";
import { formatBytes } from "@/lib/utils";

type DashboardTab = "overview" | "favorites" | "recent" | "history" | "settings";

interface RecentFileItem {
  id: string;
  name: string;
  tool: string;
  toolSlug: string;
  date: string;
  sizeBytes: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tabletDrawerOpen, setTabletDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showChartTableFallback, setShowChartTableFallback] = useState(false);

  // User state stored in localStorage
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFileItem[]>([]);
  const [settingsQuality, setSettingsQuality] = useState("high");
  const [settingsAutoDelete, setSettingsAutoDelete] = useState("24h");
  const [searchQuery, setSearchQuery] = useState("");

  // Activity stats
  const activityDays = [
    { day: "Mon", count: 4, label: "4 files processed on Monday" },
    { day: "Tue", count: 7, label: "7 files processed on Tuesday" },
    { day: "Wed", count: 3, label: "3 files processed on Wednesday" },
    { day: "Thu", count: 9, label: "9 files processed on Thursday" },
    { day: "Fri", count: 6, label: "6 files processed on Friday" },
    { day: "Sat", count: 2, label: "2 files processed on Saturday" },
    { day: "Sun", count: 5, label: "5 files processed on Sunday" },
  ];

  const maxActivity = Math.max(...activityDays.map((d) => d.count));

  // Initialize and load saved state
  useEffect(() => {
    try {
      // Simulate loading state to demonstrate skeleton loaders
      const timer = setTimeout(() => {
        const rawFavs = localStorage.getItem("trysomenew_favorites");
        if (rawFavs) {
          setFavoriteSlugs(JSON.parse(rawFavs));
        } else {
          setFavoriteSlugs(["merge-pdf", "image-to-pdf", "ocr-image", "compress-pdf"]);
        }

        const rawFiles = localStorage.getItem("trysomenew_recent_files");
        if (rawFiles) {
          setRecentFiles(JSON.parse(rawFiles));
        } else {
          setRecentFiles([
            { id: "1", name: "Contract_Signed_2026.pdf", tool: "Merge PDF", toolSlug: "merge-pdf", date: "Today, 10:15 AM", sizeBytes: 3420000 },
            { id: "2", name: "Receipt_Scan_March.png", tool: "Image OCR", toolSlug: "ocr-image", date: "Yesterday, 04:30 PM", sizeBytes: 1250000 },
            { id: "3", name: "Q1_Financial_Report.pdf", tool: "Compress PDF", toolSlug: "compress-pdf", date: "03 Apr 2026", sizeBytes: 7890000 },
          ]);
        }

        const savedQuality = localStorage.getItem("trysomenew_quality");
        if (savedQuality) setSettingsQuality(savedQuality);

        const savedAutoDelete = localStorage.getItem("trysomenew_autodelete");
        if (savedAutoDelete) setSettingsAutoDelete(savedAutoDelete);

        setIsLoading(false);
      }, 350);

      return () => clearTimeout(timer);
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }, []);

  const favoriteTools = TOOLS_CONFIG.filter((t) => favoriteSlugs.includes(t.slug));
  const recentTools = TOOLS_CONFIG.slice(0, 4);

  const handleDeleteFile = (id: string) => {
    const updated = recentFiles.filter((f) => f.id !== id);
    setRecentFiles(updated);
    try {
      localStorage.setItem("trysomenew_recent_files", JSON.stringify(updated));
    } catch {}
  };

  const handleClearHistory = () => {
    setRecentFiles([]);
    try {
      localStorage.removeItem("trysomenew_recent_files");
    } catch {}
  };

  const handleQualityChange = (val: string) => {
    setSettingsQuality(val);
    try {
      localStorage.setItem("trysomenew_quality", val);
    } catch {}
  };

  const handleAutoDeleteChange = (val: string) => {
    setSettingsAutoDelete(val);
    try {
      localStorage.setItem("trysomenew_autodelete", val);
    } catch {}
  };

  const sidebarLinks: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "favorites", label: "Favorites", icon: <Star className="w-4 h-4" /> },
    { id: "recent", label: "Recent Tools", icon: <Clock className="w-4 h-4" /> },
    { id: "history", label: "File History", icon: <FileText className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  if (hasError) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState
          title="Could not load workspace"
          message="There was an issue reading your local storage settings. Please refresh or reset data."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100dvh-60px)] bg-[var(--paper)] flex flex-col md:flex-row text-left select-none">
      {/* 1. DESKTOP SIDEBAR (248px / Collapsible to 64px) */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-[var(--sunken)] border-r border-[var(--line)] p-4 transition-all duration-200 ${
          sidebarCollapsed ? "w-16 items-center px-2" : "w-[248px]"
        }`}
      >
        <div className="space-y-6 w-full">
          {/* Top Collapse Control */}
          <div className="flex items-center justify-between px-2">
            {!sidebarCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Workspace
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-[4px] hover:bg-[var(--line)]/50 text-[var(--muted)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 w-full">
            {sidebarLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[6px] transition-colors relative text-left cursor-pointer ${
                    isActive
                      ? "bg-[var(--pine-tint)] text-[var(--pine)] font-semibold"
                      : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40"
                  }`}
                >
                  {/* Active 3px Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[var(--pine)] rounded-r" />
                  )}
                  <span className={isActive ? "text-[var(--pine)]" : "text-[var(--muted)]"}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}

            <div className="pt-3 my-2 border-t border-[var(--line)]" />

            <Link
              href="/tools"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition-colors"
            >
              <Grid className="w-4 h-4" />
              {!sidebarCollapsed && <span>All 177+ Tools</span>}
            </Link>

            <Link
              href="/beam"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition-colors"
            >
              <Radio className="w-4 h-4 text-[var(--terracotta)]" />
              {!sidebarCollapsed && <span>Beam Sync</span>}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-[6px] text-xs text-[var(--muted)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--pine)] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Local Storage Active</span>
            </div>
            <p className="text-[11px] leading-tight">Data never leaves your browser.</p>
          </div>
        )}
      </aside>

      {/* 2. TABLET DRAWER (Triggered by mobile top bar) */}
      <Drawer
        isOpen={tabletDrawerOpen}
        onClose={() => setTabletDrawerOpen(false)}
        title="Workspace Hub"
        position="left"
      >
        <div className="space-y-2 py-2">
          {sidebarLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setTabletDrawerOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-[6px] transition-colors text-left ${
                activeTab === item.id
                  ? "bg-[var(--pine-tint)] text-[var(--pine)] font-semibold"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </Drawer>

      {/* 3. MAIN DASHBOARD CONTENT AREA (max 1100px) */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1100px] mx-auto w-full space-y-8">
        {/* Tablet / Mobile Sub-header */}
        <div className="flex lg:hidden items-center justify-between pb-3 border-b border-[var(--line)]">
          <button
            onClick={() => setTabletDrawerOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)] px-2.5 py-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--surface)]"
          >
            <Menu className="w-4 h-4" />
            <span>Workspace Menu</span>
          </button>
          <span className="text-xs font-semibold text-[var(--muted)] uppercase">
            {activeTab}
          </span>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Greeting + Quick Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Workspace Overview</h1>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  Welcome to your private in-browser document toolbox.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter saved items..."
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* 4 Stat Tiles in One Row (IBM Plex Mono numbers, muted label, no colored icons) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height={84} className="rounded-[8px]" />
                ))
              ) : (
                <>
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4">
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                      36
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">Files Processed</div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4">
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                      18m
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">Time Saved</div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4">
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                      12.5 MB
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">Storage Saved</div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4">
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                      8
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-1">Tools Used</div>
                  </div>
                </>
              )}
            </div>

            {/* "Continue where you left off" — Compact rows */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Continue where you left off</h3>
                <Link href="/tools" className="text-xs font-semibold text-[var(--pine)] hover:underline">
                  All Tools
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton height={112} className="rounded-[8px]" />
                  <Skeleton height={112} className="rounded-[8px]" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              )}
            </div>

            {/* Pinned Favorites Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pinned favorites</h3>
                <span className="text-xs text-[var(--muted)]">
                  {favoriteTools.length} tools pinned
                </span>
              </div>

              {favoriteTools.length === 0 ? (
                <EmptyState
                  title="No favorites pinned"
                  description="Click the star on any tool card to add it to your pinned dashboard."
                  actionText="Explore Tools Directory"
                  actionHref="/tools"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {favoriteTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              )}
            </div>

            {/* 7-Day Activity Bar Chart in Pine + Accessible Table Fallback */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">7-Day Processing Activity</h3>
                  <p className="text-xs text-[var(--muted)]">Files converted locally in memory</p>
                </div>
                <button
                  onClick={() => setShowChartTableFallback(!showChartTableFallback)}
                  className="text-xs font-medium text-[var(--pine)] hover:underline"
                >
                  {showChartTableFallback ? "Show Visual Chart" : "View Data Table"}
                </button>
              </div>

              {showChartTableFallback ? (
                /* Accessible Table Fallback */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-[var(--line)]">
                    <thead className="bg-[var(--sunken)] border-b border-[var(--line)]">
                      <tr>
                        <th className="p-2 font-semibold">Day</th>
                        <th className="p-2 font-semibold font-mono">Files Processed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {activityDays.map((d) => (
                        <tr key={d.day}>
                          <td className="p-2">{d.day}</td>
                          <td className="p-2 font-mono">{d.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Pure CSS Pine Bar Chart */
                <div className="flex items-end justify-between gap-2 h-36 pt-6 border-b border-[var(--line)]">
                  {activityDays.map((item) => {
                    const heightPercent = Math.round((item.count / maxActivity) * 100);
                    return (
                      <div
                        key={item.day}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                        title={item.label}
                      >
                        <span className="text-[10px] font-mono text-[var(--muted)] group-hover:text-[var(--pine)]">
                          {item.count}
                        </span>
                        <div
                          className="w-full max-w-[32px] bg-[var(--pine)] rounded-t-[3px] transition-all group-hover:bg-[var(--pine-hover)]"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-medium text-[var(--muted)] mt-1">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Files Table (Becomes stacked cards on mobile) */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Recent File History</h3>
                  <p className="text-xs text-[var(--muted)]">Processed locally in current session</p>
                </div>
                {recentFiles.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-xs font-semibold text-[var(--error)] hover:underline"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {recentFiles.length === 0 ? (
                <EmptyState
                  title="No files processed yet"
                  description="Files you convert or merge will be listed here for quick access."
                  actionText="Open Merge PDF"
                  actionHref="/pdf/merge"
                />
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[var(--sunken)] border-b border-[var(--line)]">
                        <tr>
                          <th className="p-3 font-semibold text-[var(--ink)]">File Name</th>
                          <th className="p-3 font-semibold text-[var(--ink)]">Tool</th>
                          <th className="p-3 font-semibold text-[var(--ink)]">Date</th>
                          <th className="p-3 font-semibold text-[var(--ink)]">Size</th>
                          <th className="p-3 font-semibold text-[var(--ink)] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {recentFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-[var(--sunken)]/50">
                            <td className="p-3 font-medium text-[var(--ink)]">{file.name}</td>
                            <td className="p-3">
                              <Link href={`/${file.toolSlug}`} className="text-[var(--pine)] hover:underline">
                                {file.tool}
                              </Link>
                            </td>
                            <td className="p-3 text-[var(--muted)]">{file.date}</td>
                            <td className="p-3 font-mono text-[var(--muted)]">
                              {formatBytes(file.sizeBytes)}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                aria-label="Delete item from history"
                                className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--error)]"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked Cards */}
                  <div className="sm:hidden space-y-2">
                    {recentFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[6px] space-y-1.5"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold text-xs text-[var(--ink)] break-all">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1 text-[var(--muted)] hover:text-[var(--error)]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                          <span>{file.tool}</span>
                          <span className="font-mono">{formatBytes(file.sizeBytes)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Your Favorites</h2>
              <p className="text-sm text-[var(--muted)]">Quick shortcuts to the tools you use most.</p>
            </div>

            {favoriteTools.length === 0 ? (
              <EmptyState
                title="No favorite tools saved"
                description="Click the star on any tool card to add it to your favorites."
                actionText="Browse Tools Directory"
                actionHref="/tools"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* RECENT TOOLS TAB */}
        {activeTab === "recent" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Recent Tools</h2>
              <p className="text-sm text-[var(--muted)]">Tools opened in your current workspace.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Processed File History</h2>
                <p className="text-sm text-[var(--muted)]">Stored solely in your local browser memory.</p>
              </div>
              {recentFiles.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="btn-secondary text-xs h-8 text-[var(--error)]"
                >
                  Clear All History
                </button>
              )}
            </div>

            {recentFiles.length === 0 ? (
              <EmptyState
                title="History is empty"
                description="Process any PDF or image to see audit entries here."
                actionText="Open Image to PDF"
                actionHref="/image/to-pdf"
              />
            ) : (
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--sunken)] border-b border-[var(--line)]">
                    <tr>
                      <th className="p-3 font-semibold">File Name</th>
                      <th className="p-3 font-semibold">Tool Used</th>
                      <th className="p-3 font-semibold">Timestamp</th>
                      <th className="p-3 font-semibold">File Size</th>
                      <th className="p-3 font-semibold text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {recentFiles.map((f) => (
                      <tr key={f.id} className="hover:bg-[var(--sunken)]/50">
                        <td className="p-3 font-medium text-[var(--ink)]">{f.name}</td>
                        <td className="p-3 text-[var(--pine)]">{f.tool}</td>
                        <td className="p-3 text-[var(--muted)]">{f.date}</td>
                        <td className="p-3 font-mono">{formatBytes(f.sizeBytes)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteFile(f.id)}
                            className="p-1 text-[var(--muted)] hover:text-[var(--error)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-semibold">Workspace Settings</h2>
              <p className="text-sm text-[var(--muted)]">
                Preferences are saved locally in your browser.
              </p>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 space-y-6">
              {/* Default Quality Preset */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)] block">
                  Default Export Quality
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["high", "medium", "low"].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQualityChange(q)}
                      className={`p-3 text-xs font-semibold capitalize rounded-[6px] border text-center transition-colors ${
                        settingsQuality === q
                          ? "bg-[var(--pine-tint)] border-[var(--pine)] text-[var(--pine)]"
                          : "border-[var(--line)] hover:border-[var(--muted)]"
                      }`}
                    >
                      {q} Quality
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Delete Duration */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)] block">
                  Session Auto-Delete Period
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["1h", "24h", "7d"].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleAutoDeleteChange(d)}
                      className={`p-3 text-xs font-semibold rounded-[6px] border text-center transition-colors ${
                        settingsAutoDelete === d
                          ? "bg-[var(--pine-tint)] border-[var(--pine)] text-[var(--pine)]"
                          : "border-[var(--line)] hover:border-[var(--muted)]"
                      }`}
                    >
                      {d === "1h" ? "1 Hour" : d === "24h" ? "24 Hours" : "7 Days"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger Zone: Clear Data */}
              <div className="pt-4 border-t border-[var(--line)] space-y-3">
                <h4 className="text-sm font-semibold text-[var(--error)]">Privacy & Local Storage</h4>
                <p className="text-xs text-[var(--muted)]">
                  Erase all cached file history, favorite pins, and user preferences from your browser.
                </p>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="btn-secondary text-xs h-9 px-4 text-[var(--error)] hover:border-[var(--error)]"
                >
                  Clear All Local Storage Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
