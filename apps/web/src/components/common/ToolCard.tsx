"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { ToolConfig, CATEGORY_TINTS, ToolCategory } from "@/config/tools";
import { DynamicIcon } from "./DynamicIcon";
import { clsx } from "clsx";

export interface ToolCardProps {
  tool: ToolConfig;
  onToggleFavorite?: (slug: string) => void;
  isFavorited?: boolean;
  className?: string;
}

export function ToolCard({ tool, onToggleFavorite, isFavorited: propFavorited, className }: ToolCardProps) {
  const [isFav, setIsFav] = useState(false);
  const catTint = CATEGORY_TINTS[tool.category as ToolCategory] || {
    bg: "#EFEBE3",
    text: "#1E2421",
    iconBg: "#EFEBE3",
  };

  useEffect(() => {
    if (typeof propFavorited !== "undefined") {
      setIsFav(propFavorited);
    } else if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("trysomenew_favorites");
        const favs: string[] = raw ? JSON.parse(raw) : [];
        setIsFav(favs.includes(tool.slug));
      } catch {}
    }
  }, [propFavorited, tool.slug]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFav;
    setIsFav(next);

    try {
      const raw = localStorage.getItem("trysomenew_favorites");
      let favs: string[] = raw ? JSON.parse(raw) : [];
      if (next) {
        if (!favs.includes(tool.slug)) favs.push(tool.slug);
      } else {
        favs = favs.filter((id) => id !== tool.slug);
      }
      localStorage.setItem("trysomenew_favorites", JSON.stringify(favs));
      window.dispatchEvent(new CustomEvent("favorites-updated"));
    } catch {}

    onToggleFavorite?.(tool.slug);
  };

  return (
    <Link
      href={tool.href}
      className={clsx(
        "tool-card group relative select-none w-full",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {/* 40x40px Tinted Icon Tile */}
        <div
          className="w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{ backgroundColor: catTint.iconBg, color: catTint.text }}
        >
          <DynamicIcon name={tool.icon} className="w-5 h-5 stroke-[1.5]" />
        </div>

        {/* Top-Right: Star Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className="p-1 rounded-[4px] text-[var(--muted)]/50 hover:text-[#B7791F] transition-colors -mr-1 -mt-1"
        >
          <Star
            className={clsx(
              "w-4 h-4 transition-colors",
              isFav ? "fill-[#B7791F] text-[#B7791F]" : ""
            )}
          />
        </button>
      </div>

      {/* Title & Short Description */}
      <div className="mt-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="text-base font-semibold text-[var(--ink)] group-hover:text-[var(--pine)] transition-colors line-clamp-1">
            {tool.name}
          </h4>
          {tool.isPopular && (
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[var(--warning-tint)] text-[var(--warning)] shrink-0">
              Popular
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--muted)] line-clamp-2 leading-snug">
          {tool.shortDescription}
        </p>
      </div>
    </Link>
  );
}
