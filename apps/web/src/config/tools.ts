import { TOOLS, ToolDefinition } from "@/lib/toolsData";

import { ToolCategory, CATEGORY_NAMES, CATEGORY_TINTS } from "./categories";
export { CATEGORY_NAMES, CATEGORY_TINTS };
export type { ToolCategory };

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  keywords: string[];
  faq: ToolFaq[];
  related: string[];
  icon: string;
  href: string;
  isPopular?: boolean;
  status: "ready" | "coming_soon";
  isLocal: boolean;
  inputExtensions?: string[];
  outputExtensions?: string[];
  maxFileSizeMB?: number;
}

function mapCategory(rawCat: string): ToolCategory {
  const c = rawCat.toLowerCase();
  if (c.includes("pdf") || c.includes("stamp") || c.includes("watermark")) return "pdf";
  if (c.includes("image") || c.includes("color") || c.includes("svg")) return "image";
  if (c.includes("video") || c.includes("audio") || c.includes("media") || c.includes("gif")) return "video";
  if (c.includes("text") || c.includes("ocr") || c.includes("document") || c.includes("education")) return "text";
  if (c.includes("convert") || c.includes("archive") || c.includes("qr") || c.includes("barcode") || c.includes("print") || c.includes("spreadsheet")) return "converters";
  if (c.includes("developer") || c.includes("web") || c.includes("code")) return "developer";
  if (c.includes("calc")) return "calculators";
  if (c.includes("security") || c.includes("verify") || c.includes("sign")) return "security";
  if (c.includes("business") || c.includes("workflow") || c.includes("cloud")) return "business";
  return "misc";
}

// ─── SPECIFIC CURATED METADATA & FAQS FOR POPULAR TOOLS ───
const CURATED_DETAILS: Record<string, Partial<ToolConfig>> = {
  "merge-pdf": {
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf joiner", "merge pdf online"],
    faq: [
      { question: "Are my PDF files uploaded to a server?", answer: "No. All files are merged 100% locally in your browser memory using WebAssembly." },
      { question: "Is there a limit on how many PDFs I can merge?", answer: "You can merge dozens of files up to 200MB total directly on your device." },
      { question: "Can I reorder pages before merging?", answer: "Yes, you can drag and drop to reorder files and preview pages before downloading." },
    ],
    related: ["split-pdf", "compress-pdf", "image-to-pdf", "pdf-redact", "rotate-pdf"],
  },
  "split-pdf": {
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "divide pdf"],
    faq: [
      { question: "Can I extract specific page ranges like 1-3, 5?", answer: "Yes, enter custom page ranges or select individual page thumbnails visually." },
      { question: "Does splitting reduce file quality?", answer: "No. Splitting extracts the original lossless streams with zero degradation." },
    ],
    related: ["merge-pdf", "compress-pdf", "rotate-pdf", "image-to-pdf", "pdf-redact"],
  },
  "compress-pdf": {
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "smaller pdf file"],
    faq: [
      { question: "How much can I reduce my PDF size?", answer: "Typical savings range from 30% to 80% depending on embedded images and metadata." },
      { question: "Will compressing affect text readability?", answer: "No. Vector text remains crystal sharp while unneeded image bloat is optimized." },
    ],
    related: ["merge-pdf", "split-pdf", "image-to-pdf", "pdf-redact", "pdf-to-jpg"],
  },
  "image-to-pdf": {
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photo to pdf", "pictures to pdf"],
    faq: [
      { question: "Can I combine multiple photos into one PDF?", answer: "Yes, upload multiple photos, reorder them, adjust margins, and export as a single PDF." },
      { question: "What image formats are supported?", answer: "JPG, JPEG, PNG, WEBP, BMP, and SVG are all supported." },
    ],
    related: ["pdf-to-jpg", "merge-pdf", "compress-pdf", "ocr-image"],
  },
  "ocr-image": {
    keywords: ["image ocr", "extract text from image", "photo to text", "scan receipt to text"],
    faq: [
      { question: "Does OCR require an internet connection?", answer: "No. The OCR engine runs locally in your browser using WebAssembly." },
    ],
    related: ["ai-summarize", "image-to-pdf", "markdown-to-pdf", "invoice-generator"],
  },
  "invoice-generator": {
    keywords: ["invoice generator", "free invoice maker", "create receipt pdf", "freelance bill generator"],
    faq: [
      { question: "Can I add my business logo and currency?", answer: "Yes, customize logo, tax rates, currency symbol, line items, and payment notes." },
    ],
    related: ["draw-signature", "type-signature", "merge-pdf", "verify"],
  },
  "screen-recorder": {
    keywords: ["screen recorder online", "record monitor", "browser screen capture", "record audio video"],
    faq: [
      { question: "Is there a recording watermark or time limit?", answer: "No watermarks, no software downloads, and no limits on recording duration." },
    ],
    related: ["video-compress", "gif-maker", "svg-viewer"],
  },
  "beam": {
    keywords: ["online clipboard", "beam", "phone to pc clipboard", "instant file transfer", "p2p clipboard"],
    faq: [
      { question: "How does Beam pair my devices?", answer: "Scan the on-screen QR code from your phone or enter the 6-character room code on PC." },
      { question: "Is my data uploaded to a server?", answer: "No. Text and files travel over a direct WebRTC connection between your two devices, which is encrypted (DTLS) by the browser. Only a tiny pairing handshake goes through a signalling server." },
    { question: "Do both devices need to be open?", answer: "Yes. Beam is a live connection, so keep the page open on both devices while sending." },
    ],
    related: ["verify", "qr-generator", "json-formatter"],
  },
};

// ─── COMBINE ALL TOOLS WITH CURATED DETAILS ───
const allBaseTools: ToolConfig[] = TOOLS.map((t: ToolDefinition) => {
  const cat = mapCategory(t.category);
  const curated = CURATED_DETAILS[t.id] || {};

  return {
    slug: t.id,
    name: t.name,
    category: cat,
    shortDescription: t.description,
    keywords: curated.keywords || t.tags || [t.name.toLowerCase()],
    faq: curated.faq || [
      {
        question: `How does ${t.name} work?`,
        answer: `${t.name} processes your files locally inside your browser memory with zero server uploads and complete document privacy.`,
      },
      {
        question: "Is there any limit or fee?",
        answer: "No. All tools on trysomenew are 100% free with no page caps, watermarks, or hidden paywalls.",
      },
    ],
    related: curated.related || [],
    icon: t.iconName,
    href: t.href,
    isPopular: t.isPopular || false,
    status: t.status,
    isLocal: t.isLocal,
    inputExtensions: t.inputExtensions,
    outputExtensions: t.outputExtensions,
    maxFileSizeMB: 100,
  };
});

// Beam signature tool
const beamTool: ToolConfig = {
  slug: "beam",
  name: "Beam Live Clipboard",
  category: "misc",
  shortDescription: "Send text, links and files directly between your phone and PC. Scan a QR code to pair — peer-to-peer, no upload.",
  keywords: ["online clipboard", "beam", "phone to pc clipboard", "instant file transfer", "p2p clipboard"],
  faq: [
    { question: "How does Beam pair my devices?", answer: "Scan the on-screen QR code from your phone or enter the 6-character room code on PC." },
    { question: "Is my data uploaded to a server?", answer: "No. Text and files travel over a direct WebRTC connection between your two devices, which is encrypted (DTLS) by the browser. Only a tiny pairing handshake goes through a signalling server." },
    { question: "Do both devices need to be open?", answer: "Yes. Beam is a live connection, so keep the page open on both devices while sending." },
  ],
  related: ["qr-generator", "verify"],
  icon: "Radio",
  href: "/beam",
  isPopular: true,
  status: "ready",
  isLocal: true,
};

// Deduplicate and assemble the catalog (Beam first, then everything else)
const toolMap = new Map<string, ToolConfig>();
toolMap.set(beamTool.slug, beamTool);
for (const t of allBaseTools) {
  if (!toolMap.has(t.slug)) toolMap.set(t.slug, t);
}

/** Every tool, including ones that are still on the roadmap. */
export const ALL_TOOLS_CONFIG: ToolConfig[] = Array.from(toolMap.values());

/** Only tools that actually work today. Use this for every listing, menu, search and sitemap. */
export const TOOLS_CONFIG: ToolConfig[] = ALL_TOOLS_CONFIG.filter((t) => t.status === "ready");

/** Number of distinct working tool pages (several tools share one page, e.g. split/extract/delete). */
export const TOOL_PAGE_COUNT = new Set(TOOLS_CONFIG.map((t) => t.href.split("?")[0])).size;
