import { ToolDefinition, TOOLS } from "./toolsData";

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
  matchedField: "name" | "synonym" | "tag" | "desc" | "category";
}

// Synonyms map to empower user colloquial queries
const SYNONYMS_MAP: Record<string, string[]> = {
  // PDF
  "image-to-pdf": ["photo to pdf", "picture to pdf", "photos to pdf", "jpg to pdf", "png to pdf", "pic to pdf", "convert images"],
  "merge-pdf": ["combine pdf", "join pdf", "put together", "unite pdf", "stitch pdf"],
  "split-pdf": ["cut pdf", "extract pages", "separate pdf", "divide pdf", "burst pdf"],
  "compress-pdf": ["reduce size", "shrink pdf", "smaller pdf", "downsize", "compress file", "lower mb"],
  "rotate-pdf": ["turn pdf", "flip pdf", "orientation", "upside down"],
  "pdf-redact": ["black out", "hide sensitive", "remove text", "censor", "mask"],
  
  // OCR & AI
  "ocr-image": ["photo to text", "image to text", "extract text", "picture text", "read photo", "scanned text"],
  "ocr-pdf": ["scanned pdf", "searchable pdf", "pdf to text ocr", "read scanned"],
  "ai-summarizer": ["summarize", "tldr", "bullet points", "executive summary", "shorten document"],
  "ai-chat-pdf": ["talk to pdf", "ask pdf", "query document", "chat assistant", "pdf bot"],
  
  // Sign & Business
  "draw-signature": ["sign pdf", "e-sign", "signature maker", "draw sign", "touch signature"],
  "type-signature": ["typed signature", "calligraphy sign", "cursive signature", "font sign"],
  "invoice-gen": ["bill maker", "create bill", "invoice pdf", "freelance invoice", "client bill"],
  "receipt-gen": ["thermal receipt", "payment slip", "sales receipt", "cash receipt"],
  
  // Audio & Recording
  "audio-to-text": ["speech to text", "voice typing", "dictation", "transcribe audio", "voice notes"],
  "text-to-speech": ["read aloud", "voiceover", "voice synthesis", "audio reader", "speak text"],
  "screen-recorder": ["screen capture", "record screen", "capture monitor", "record video"],
  
  // Developer & Security
  "json-formatter": ["beautify json", "prettify json", "minify json", "clean json"],
  "password-gen": ["strong password", "random password", "passcode generator"],
  "base64": ["base64 decode", "base64 encode", "base 64"],
  "document-verification": ["verify hash", "tamper check", "sha256 digest", "integrity"],
};

/**
 * Normalizes string for sub-50ms matching
 */
function clean(str: string): string {
  return str.toLowerCase().trim().replace(/[-_]/g, " ");
}

/**
 * Computes an instant relevance score between 0 and 100
 */
function calculateScore(tool: ToolDefinition, queryWords: string[], rawQuery: string): SearchResult | null {
  const nameClean = clean(tool.name);
  const descClean = clean(tool.description);
  const catClean = clean(tool.category);
  const tagsClean = tool.tags.map(clean);
  const synonyms = (SYNONYMS_MAP[tool.id] || []).map(clean);

  // Exact name match
  if (nameClean === rawQuery) {
    return { tool, score: 100, matchedField: "name" };
  }

  // Name starts with query
  if (nameClean.startsWith(rawQuery)) {
    return { tool, score: 95, matchedField: "name" };
  }

  // Exact synonym match (e.g. "photo to pdf")
  for (const syn of synonyms) {
    if (syn === rawQuery) {
      return { tool, score: 92, matchedField: "synonym" };
    }
    if (syn.startsWith(rawQuery) || rawQuery.startsWith(syn)) {
      return { tool, score: 88, matchedField: "synonym" };
    }
  }

  // Name contains query
  if (nameClean.includes(rawQuery)) {
    return { tool, score: 85, matchedField: "name" };
  }

  // Check word intersections
  let wordScore = 0;
  for (const word of queryWords) {
    if (nameClean.includes(word)) wordScore += 25;
    else if (synonyms.some((s) => s.includes(word))) wordScore += 20;
    else if (tagsClean.some((t) => t.includes(word))) wordScore += 15;
    else if (descClean.includes(word)) wordScore += 8;
    else if (catClean.includes(word)) wordScore += 5;
  }

  if (wordScore > 0) {
    // Add popular boost
    const finalScore = Math.min(84, wordScore + (tool.isPopular ? 10 : 0));
    return { tool, score: finalScore, matchedField: "tag" };
  }

  return null;
}

/**
 * Ultra-fast local search returning max 8 results in under 5ms
 */
export function instantSearch(query: string, maxResults = 8): ToolDefinition[] {
  const trimmed = clean(query);
  if (!trimmed) {
    return TOOLS.filter((t) => t.isPopular && t.status === "ready").slice(0, maxResults);
  }

  const queryWords = trimmed.split(/\s+/).filter(Boolean);
  const scoredResults: SearchResult[] = [];

  for (const tool of TOOLS) {
    if (tool.status !== "ready") continue;
    const scored = calculateScore(tool, queryWords, trimmed);
    if (scored) {
      scoredResults.push(scored);
    }
  }

  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.slice(0, maxResults).map((r) => r.tool);
}

// Recent searches manager in localStorage
const RECENT_SEARCHES_KEY = "trysomenew_recent_searches";

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(term: string) {
  if (typeof window === "undefined") return;
  const cleanTerm = term.trim();
  if (!cleanTerm || cleanTerm.length < 2) return;
  try {
    const existing = getRecentSearches().filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase());
    const updated = [cleanTerm, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}
