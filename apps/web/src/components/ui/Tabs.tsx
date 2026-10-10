import React from "react";
import { clsx } from "clsx";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx("flex items-center gap-1 border-b border-[var(--line)] overflow-x-auto", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "px-3.5 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap -mb-px flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[var(--pine)]",
              isActive
                ? "text-[var(--pine)] font-semibold border-b-2 border-[var(--pine)]"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            )}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={clsx(
                  "px-1.5 py-0.2 text-xs rounded-full font-mono font-medium",
                  isActive ? "bg-[var(--pine-tint)] text-[var(--pine)]" : "bg-[var(--sunken)] text-[var(--muted)]"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
