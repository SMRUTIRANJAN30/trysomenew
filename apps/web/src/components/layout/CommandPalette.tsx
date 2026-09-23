"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Command } from "lucide-react";
import { TOOLS, ToolDefinition, detectExtensionQuery } from "@/lib/toolsData";
import { DynamicIcon } from "@/components/common/DynamicIcon";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter tools based on query with strict extension matching
  const detectedExt = detectExtensionQuery(query);

  const filteredTools = TOOLS.filter((tool) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();

    if (detectedExt) {
      const ext = detectedExt.toLowerCase();
      const supportsInput = tool.inputExtensions?.some((e) => e.toLowerCase() === ext || e === "*");
      const supportsOutput = tool.outputExtensions?.some((e) => e.toLowerCase() === ext || e === "*");
      if (!supportsInput && !supportsOutput) return false;

      // If user typed more words with extension (e.g. "png pdf")
      if (q !== ext && q !== `.${ext}`) {
        const words = q.split(/\s+/).filter((w) => w !== ext && w !== `.${ext}`);
        return words.every(
          (w) =>
            tool.name.toLowerCase().includes(w) ||
            tool.description.toLowerCase().includes(w) ||
            tool.tags.some((tag) => tag.toLowerCase().includes(w))
        );
      }
      return true;
    }

    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global toggle with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
          const event = new CustomEvent("toggle-command-palette");
          window.dispatchEvent(event);
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredTools.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredTools[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  const handleSelect = (tool: ToolDefinition) => {
    onClose();
    if (tool.status === "ready") {
      router.push(tool.href);
    } else {
      router.push(`/tools#${tool.category}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[var(--background)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--card-bg)]">
          <Search className="w-5 h-5 text-[var(--muted-text)] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name or action (e.g. 'merge', 'split', 'verify', 'to image')..."
            className="w-full bg-transparent text-[var(--foreground)] placeholder-[var(--muted-text)] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[var(--muted-text)] hover:text-[var(--foreground)] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center ml-2 px-1.5 py-0.5 text-[10px] text-[var(--muted-text)] bg-black/5 dark:bg-white/10 rounded border border-[var(--border-subtle)] font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-[var(--muted-text)] text-sm">
              <p>No tools matched &ldquo;{query}&rdquo;.</p>
              <p className="text-xs text-[var(--muted-text)] mt-1">Try searching for merge, split, compress, or verify.</p>
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-500/15 border border-blue-500/30 text-[var(--foreground)]"
                      : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{tool.name}</span>
                        {tool.status === "ready" ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                            Ready
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">
                            Phase 2
                          </span>
                        )}
                        {tool.isLocal && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            • Local-First
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{tool.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-blue-400">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? "text-blue-400 translate-x-1" : "text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Fast browser workspace</span>
          </span>
        </div>
      </div>
    </div>
  );
}
