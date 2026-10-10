"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Grid,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
} from "lucide-react";
import { TOOLS_CONFIG, CATEGORY_NAMES, CATEGORY_TINTS, ToolCategory, ToolConfig } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { Tabs } from "@/components/ui/Tabs";

export default function ToolsDirectoryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Tools" },
    { id: "pdf", label: "PDF Tools" },
    { id: "image", label: "Image Tools" },
    { id: "text", label: "Text & AI" },
    { id: "converters", label: "Converters" },
    { id: "business", label: "Business" },
    { id: "developer", label: "Developer" },
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_CONFIG.filter((tool) => {
      // 1. Category Filter
      if (activeCategory !== "all" && tool.category !== activeCategory) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.shortDescription.toLowerCase().includes(q);
        const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
        return matchName || matchDesc || matchKeywords;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% In-Browser Tools</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Tools Directory
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl">
          Browse our complete catalog of browser-based document, image, conversion, and developer utilities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, task or format..."
              className="pl-9 h-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-[var(--muted)] shrink-0">
            Showing <strong className="font-mono text-[var(--ink)]">{filteredTools.length}</strong> tools
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-2 border-t border-[var(--line)]">
          <Tabs
            tabs={categories.map((c) => ({
              id: c.id,
              label: c.label,
              count:
                c.id === "all"
                  ? TOOLS_CONFIG.length
                  : TOOLS_CONFIG.filter((t) => t.category === c.id).length,
            }))}
            activeTab={activeCategory}
            onChange={(id) => setActiveCategory(id)}
          />
        </div>
      </div>

      {/* Tool Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-[var(--surface)] border border-[var(--line)] rounded-[8px] space-y-3">
          <FileText className="w-10 h-10 text-[var(--muted)] mx-auto" />
          <h3 className="text-base font-semibold text-[var(--ink)]">No tools match your search</h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Try searching with broader terms or clear the active category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="btn-secondary text-xs h-8 px-3"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
