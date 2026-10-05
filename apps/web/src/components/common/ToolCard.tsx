"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToolDefinition } from "@/lib/toolsData";
import { DynamicIcon } from "./DynamicIcon";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { Flame, Sparkles, Star } from "lucide-react";

interface ToolCardProps {
  tool: ToolDefinition;
  onToggleFavorite?: (toolId: string) => void;
  isFavorited?: boolean;
}

export function ToolCard({ tool, onToggleFavorite, isFavorited: propFavorited }: ToolCardProps) {
  const theme = getCategoryTheme(tool.category);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (typeof propFavorited !== "undefined") {
      setIsFav(propFavorited);
    } else if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("trysomenew_favorites");
        const favs: string[] = raw ? JSON.parse(raw) : [];
        setIsFav(favs.includes(tool.id));
      } catch {}
    }
  }, [propFavorited, tool.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFav;
    setIsFav(next);

    try {
      const raw = localStorage.getItem("trysomenew_favorites");
      let favs: string[] = raw ? JSON.parse(raw) : [];
      if (next) {
        if (!favs.includes(tool.id)) favs.push(tool.id);
      } else {
        favs = favs.filter((id) => id !== tool.id);
      }
      localStorage.setItem("trysomenew_favorites", JSON.stringify(favs));
      window.dispatchEvent(new CustomEvent("favorites-updated"));
    } catch {}

    onToggleFavorite?.(tool.id);
  };

  return (
    <Link
      href={tool.href}
      className="card-tool group relative flex flex-col justify-between p-5 min-h-[150px] w-full text-left"
    >
      {/* Top Row: 48x48 Tinted Icon & Top-Right Badge / Favorite */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.bgLight} ${theme.textLight} transition-transform group-hover:scale-110 duration-200`}
        >
          <DynamicIcon name={tool.iconName} className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-1.5">
          {tool.isPopular && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame size={12} className="fill-amber-500" />
              <span>Popular</span>
            </span>
          )}

          {tool.phase === 3 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Sparkles size={11} />
              <span>New</span>
            </span>
          )}

          {/* Star Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title={isFav ? "Remove from favorites" : "Add to favorites"}
            aria-label="Toggle favorite"
          >
            <Star size={16} className={isFav ? "fill-amber-400 text-amber-400 opacity-100" : ""} />
          </button>
        </div>
      </div>

      {/* Bottom Content: Name & Description */}
      <div className="space-y-1 pt-3">
        <h3 className="text-base sm:text-[17px] font-bold text-[var(--text-main)] group-hover:text-[#4F46E5] transition-colors leading-snug line-clamp-1">
          {tool.name}
        </h3>
        <p className="text-xs sm:text-[13px] text-[var(--text-muted)] line-clamp-1 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
