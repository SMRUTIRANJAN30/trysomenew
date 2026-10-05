"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Command, History, Flame } from "lucide-react";
import { ToolDefinition } from "@/lib/toolsData";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { instantSearch, getRecentSearches, saveRecentSearch, clearRecentSearches } from "@/lib/searchEngine";
import { getCategoryTheme } from "@/lib/categoryTheme";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches on open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setResults(instantSearch("", 8));
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Run instant search
  useEffect(() => {
    const matched = instantSearch(query, 8);
    setResults(matched);
    setSelectedIndex(0);
  }, [query]);

  // Handle global shortcuts "/" and Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      // Global toggle with "/" (when not typing in an input)
      if (e.key === "/" && !isInput && !isOpen) {
        e.preventDefault();
        const event = new CustomEvent("toggle-command-palette");
        window.dispatchEvent(event);
        return;
      }

      // Global toggle with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const event = new CustomEvent("toggle-command-palette");
          window.dispatchEvent(event);
        }
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (tool: ToolDefinition) => {
    saveRecentSearch(query.trim() || tool.name);
    onClose();
    router.push(tool.href);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (60px high) */}
        <div className="flex items-center px-4 border-b border-[var(--border-card)] bg-[var(--bg-card)] h-[60px] gap-3">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 177+ tools... e.g. image to pdf, reduce size"
            className="flex-1 bg-transparent border-none outline-none text-base text-[var(--text-main)] placeholder-[var(--text-muted)] h-full font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0">
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-card)] font-mono text-[11px]">
                ESC
              </kbd>
            </div>
          )}
        </div>

        {/* Recent Searches Pills (if no query) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2.5 bg-[var(--bg-section)] border-b border-[var(--border-card)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="flex items-center gap-1 text-[var(--text-muted)] font-medium">
                <History className="w-3.5 h-3.5" /> Recent:
              </span>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentClick(term)}
                  className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] hover:border-[#4F46E5] transition-colors shrink-0"
                >
                  {term}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                clearRecentSearches();
                setRecentSearches([]);
              }}
              className="text-[11px] text-[var(--text-muted)] hover:text-red-500 transition-colors ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 max-h-[420px]">
          {results.length > 0 ? (
            results.map((tool, idx) => {
              const theme = getCategoryTheme(tool.category);
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#4F46E5]/10 dark:bg-[#4F46E5]/20 border border-[#4F46E5]/30"
                      : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.textLight}`}
                    >
                      <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--text-main)] truncate">
                          {tool.name}
                        </span>
                        {tool.isPopular && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            <Flame className="w-2.5 h-2.5" /> Popular
                          </span>
                        )}
                        {tool.phase === 3 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate max-w-md">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText}`}>
                      {theme.name}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-4 h-4 text-[#4F46E5] animate-in fade-in" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[var(--text-main)]">No matching tools found</p>
              <p className="text-xs text-[var(--text-muted)]">
                Try searching for &quot;merge&quot;, &quot;compress&quot;, &quot;ocr&quot;, or &quot;invoice&quot;
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 border-t border-[var(--border-card)] bg-[var(--bg-section)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-card)] font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-card)] font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-card)] font-mono text-[10px]">↵</kbd>
              <span>to open</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#4F46E5] dark:text-[#818cf8]">
            177+ Free Tools
          </span>
        </div>
      </div>
    </div>
  );
}
