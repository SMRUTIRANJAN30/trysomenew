"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Command, History, Star, Radio, Sun } from "lucide-react";
import { DynamicIcon } from "@/components/common/DynamicIcon";
import { searchTools, getRecentSearches, saveRecentSearch, SearchItem } from "@/lib/searchEngine";
import { CATEGORY_TINTS, CATEGORY_NAMES, ToolCategory } from "@/config/tools";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on modal open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      const { items: initialItems } = searchTools("", 8);
      setItems(initialItems);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Run instant search query
  useEffect(() => {
    const { items: matched } = searchTools(query, 8);
    setItems(matched);
    setSelectedIndex(0);
  }, [query]);

  // Global keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput = activeTag === "input" || activeTag === "textarea";

      // Global open with "/"
      if (e.key === "/" && !isInput && !isOpen) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-command-palette"));
        return;
      }

      // Global open with Ctrl+K / Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent("toggle-command-palette"));
        }
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < items.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : items.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = items[selectedIndex];
        if (selected) {
          handleExecute(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  const handleExecute = (item: SearchItem) => {
    if (item.type === "tool") {
      saveRecentSearch(query.trim() || item.data.name);
      onClose();
      router.push(item.data.href);
    } else {
      onClose();
      item.data.action();
    }
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-none animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--line)] rounded-[12px] shadow-[var(--shadow-modal)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[var(--line)] h-14 shrink-0">
          <Search className="w-5 h-5 text-[var(--muted)] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name, format, or task (e.g. merge pdf, ocr)..."
            className="w-full bg-transparent text-[var(--ink)] text-base placeholder:text-[var(--muted)]/60 focus:outline-none h-full border-0 p-0"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--sunken)] text-[var(--muted)] border border-[var(--line)]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-transparent">
          {items.length > 0 ? (
            items.map((item, index) => {
              const isSelected = index === selectedIndex;
              if (item.type === "tool") {
                const tool = item.data;
                const catTint = CATEGORY_TINTS[tool.category as ToolCategory] || { bg: "#EFEBE3", text: "#1E2421", iconBg: "#EFEBE3" };

                return (
                  <div
                    key={tool.slug}
                    onClick={() => handleExecute(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-3 rounded-[6px] cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--sunken)] text-[var(--ink)]"
                        : "hover:bg-[var(--sunken)] text-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: catTint.iconBg, color: catTint.text }}
                      >
                        <DynamicIcon name={tool.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate flex items-center gap-2">
                          <span>{tool.name}</span>
                          {tool.isPopular && (
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[var(--warning-tint)] text-[var(--warning)]">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--muted)] truncate">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[11px] font-medium text-[var(--muted)]">
                        {CATEGORY_NAMES[tool.category as ToolCategory] || tool.category}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--pine)]" />}
                    </div>
                  </div>
                );
              } else {
                const action = item.data;
                return (
                  <div
                    key={action.id}
                    onClick={() => handleExecute(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-3 rounded-[6px] cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--pine-tint)] text-[var(--pine)]"
                        : "hover:bg-[var(--sunken)] text-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[6px] bg-[var(--pine-tint)] text-[var(--pine)] flex items-center justify-center shrink-0">
                        <DynamicIcon name={action.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{action.name}</div>
                        <span className="text-xs text-[var(--muted)]">Quick Action</span>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--pine)]" />}
                  </div>
                );
              }
            })
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-sm font-medium text-[var(--ink)] mb-1">
                No tool found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[var(--muted)]">
                Try searching for: <button onClick={() => setQuery("Image to PDF")} className="text-[var(--pine)] font-semibold hover:underline">Image to PDF</button>, <button onClick={() => setQuery("Merge PDF")} className="text-[var(--pine)] font-semibold hover:underline">Merge PDF</button>, or <button onClick={() => setQuery("Compress PDF")} className="text-[var(--pine)] font-semibold hover:underline">Compress PDF</button>.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[var(--sunken)] border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
          <span className="text-[var(--pine)] font-medium">100% Client-Side Tools</span>
        </div>
      </div>
    </div>
  );
}
