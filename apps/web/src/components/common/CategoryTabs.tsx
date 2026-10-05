"use client";

import React from "react";
import {
  Layers,
  FileText,
  Image as ImageIcon,
  Video,
  Type,
  RefreshCw,
  Code2,
} from "lucide-react";

export type CategoryFilter = "all" | "pdf" | "image" | "video" | "text" | "converters" | "developer";

interface CategoryTabsProps {
  activeTab: CategoryFilter;
  onChange: (tab: CategoryFilter) => void;
  counts?: Record<CategoryFilter, number>;
}

export function CategoryTabs({ activeTab, onChange, counts }: CategoryTabsProps) {
  const tabs: { id: CategoryFilter; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Tools", icon: <Layers size={16} /> },
    { id: "pdf", label: "PDF", icon: <FileText size={16} /> },
    { id: "image", label: "Image", icon: <ImageIcon size={16} /> },
    { id: "video", label: "Video", icon: <Video size={16} /> },
    { id: "text", label: "Text & AI", icon: <Type size={16} /> },
    { id: "converters", label: "Converters", icon: <RefreshCw size={16} /> },
    { id: "developer", label: "Developer", icon: <Code2 size={16} /> },
  ];

  return (
    <div className="sticky top-16 z-30 w-full bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-card)] py-3 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = counts ? counts[tab.id] : undefined;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/30 scale-100"
                    : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border-card)]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {typeof count !== "undefined" && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-black/5 dark:bg-white/10 text-[var(--text-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
