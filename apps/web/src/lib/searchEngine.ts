import { ToolConfig, TOOLS_CONFIG, CATEGORY_NAMES, CATEGORY_TINTS } from "@/config/tools";
import { TOOLS } from "./toolsData";

export interface SearchAction {
  id: string;
  name: string;
  category: "Action";
  icon: string;
  action: () => void;
  shortcut?: string;
}

export type SearchItem = 
  | { type: "tool"; data: ToolConfig }
  | { type: "action"; data: SearchAction };

// Synonym lookup table for colloquial search phrases
const SYNONYMS_MAP: Record<string, string[]> = {
  "image-to-pdf": ["photo to pdf", "picture to pdf", "photos to pdf", "jpg to pdf", "png to pdf", "convert photos", "pic to pdf"],
  "merge-pdf": ["combine pdf", "join pdf", "put together pdf", "unite pdf", "stitch pdf", "bundle pdf"],
  "split-pdf": ["cut pdf", "extract pages", "separate pdf", "divide pdf", "burst pdf", "slice pdf"],
  "compress-pdf": ["reduce size", "shrink pdf", "smaller pdf", "downsize pdf", "compress file", "lower mb", "make pdf smaller"],
  "rotate-pdf": ["turn pdf", "flip pdf", "orientation", "upside down pdf"],
  "pdf-redact": ["black out", "hide sensitive", "remove text", "censor pdf", "mask pdf"],
  "pdf-to-jpg": ["pdf to image", "pdf to picture", "extract images from pdf", "pdf to png"],
  "ocr-image": ["photo to text", "image to text", "extract text", "read photo", "scanned text", "picture to word"],
  "ocr-pdf": ["scanned pdf", "searchable pdf", "pdf to text ocr", "read scanned"],
  "ai-summarize": ["summarize", "tldr", "bullet points", "executive summary", "shorten document"],
  "invoice-generator": ["bill maker", "create bill", "invoice pdf", "freelance invoice", "client bill"],
  "screen-recorder": ["screen capture", "record screen", "capture monitor", "record video"],
  "beam": ["online clipboard", "send to phone", "sync clipboard", "phone to pc", "quick share"],
};

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[-_]/g, " ");
}

/**
 * Sub-50ms instant fuzzy search with action commands and synonym expansion
 */
export function searchTools(query: string, limit = 8): { items: SearchItem[]; query: string } {
  const q = normalize(query);

  // If query is empty, return popular tools
  if (!q) {
    const popular = TOOLS_CONFIG.filter((t) => t.isPopular).slice(0, limit);
    return {
      items: popular.map((tool) => ({ type: "tool", data: tool })),
      query: "",
    };
  }

  const queryWords = q.split(/\s+/).filter(Boolean);
  const scoredItems: { item: SearchItem; score: number }[] = [];

  // 1. Search action commands
  const actions: SearchAction[] = [
    {
      id: "action-beam",
      name: "Open Beam Live Clipboard",
      category: "Action",
      icon: "Radio",
      action: () => {
        if (typeof window !== "undefined") window.location.href = "/beam";
      },
      shortcut: "B",
    },
    {
      id: "action-theme",
      name: "Toggle Dark / Light Mode",
      category: "Action",
      icon: "Sun",
      action: () => {
        if (typeof window !== "undefined") {
          const current = document.documentElement.getAttribute("data-theme") || "light";
          const next = current === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          localStorage.setItem("trysomenew-theme", next);
        }
      },
      shortcut: "T",
    },
    {
      id: "action-favorites",
      name: "Go to Dashboard & Favorites",
      category: "Action",
      icon: "Star",
      action: () => {
        if (typeof window !== "undefined") window.location.href = "/dashboard";
      },
      shortcut: "D",
    },
  ];

  for (const act of actions) {
    const actName = normalize(act.name);
    if (actName.includes(q)) {
      scoredItems.push({ item: { type: "action", data: act }, score: 90 });
    }
  }

  // 2. Search tool catalog
  for (const tool of TOOLS_CONFIG) {
    const nameClean = normalize(tool.name);
    const descClean = normalize(tool.shortDescription);
    const catClean = normalize(tool.category);
    const keywordsClean = tool.keywords.map(normalize);
    const synonyms = (SYNONYMS_MAP[tool.slug] || []).map(normalize);

    let score = 0;

    // Exact match
    if (nameClean === q) {
      score = 100;
    } else if (nameClean.startsWith(q)) {
      score = 95;
    } else if (synonyms.some((s) => s === q)) {
      score = 92;
    } else if (synonyms.some((s) => s.startsWith(q) || q.startsWith(s))) {
      score = 88;
    } else if (nameClean.includes(q)) {
      score = 85;
    } else {
      // Word matches
      let wordScore = 0;
      for (const word of queryWords) {
        if (nameClean.includes(word)) wordScore += 30;
        else if (synonyms.some((s) => s.includes(word))) wordScore += 25;
        else if (keywordsClean.some((k) => k.includes(word))) wordScore += 20;
        else if (descClean.includes(word)) wordScore += 10;
        else if (catClean.includes(word)) wordScore += 5;
      }
      if (wordScore > 0) {
        score = Math.min(84, wordScore + (tool.isPopular ? 8 : 0));
      }
    }

    if (score > 0) {
      scoredItems.push({ item: { type: "tool", data: tool }, score });
    }
  }

  // Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score);

  return {
    items: scoredItems.slice(0, limit).map((s) => s.item),
    query,
  };
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("trysomenew_recent_queries");
    return raw ? JSON.parse(raw) : ["Merge PDF", "Image to PDF", "Compress PDF"];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const cleanQ = query.trim();
    let current = getRecentSearches().filter((q) => q.toLowerCase() !== cleanQ.toLowerCase());
    current.unshift(cleanQ);
    current = current.slice(0, 5);
    localStorage.setItem("trysomenew_recent_queries", JSON.stringify(current));
  } catch {}
}
