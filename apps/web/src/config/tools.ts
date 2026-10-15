import { TOOLS, ToolDefinition } from "@/lib/toolsData";

export type ToolCategory =
  | "pdf"
  | "image"
  | "video"
  | "text"
  | "converters"
  | "developer"
  | "calculators"
  | "security"
  | "business"
  | "misc";

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

export const CATEGORY_NAMES: Record<ToolCategory, string> = {
  pdf: "PDF Tools",
  image: "Image Tools",
  video: "Video & Audio",
  text: "Text & Writing",
  converters: "Converters",
  developer: "Developer Tools",
  calculators: "Calculators",
  security: "Security & Privacy",
  business: "Business Tools",
  misc: "Utilities & Media",
};

export const CATEGORY_TINTS: Record<ToolCategory, { bg: string; text: string; iconBg: string }> = {
  pdf: { bg: "#F3D9D2", text: "#8A2810", iconBg: "#F3D9D2" },
  image: { bg: "#DDE8D3", text: "#1F5F4A", iconBg: "#DDE8D3" },
  video: { bg: "#E5DDEB", text: "#4A3563", iconBg: "#E5DDEB" },
  text: { bg: "#D9E4EC", text: "#1A4363", iconBg: "#D9E4EC" },
  converters: { bg: "#F1E4C8", text: "#755217", iconBg: "#F1E4C8" },
  developer: { bg: "#E2E0DA", text: "#333A36", iconBg: "#E2E0DA" },
  calculators: { bg: "#DDE8D3", text: "#1F5F4A", iconBg: "#DDE8D3" },
  security: { bg: "#F3D9D2", text: "#8A2810", iconBg: "#F3D9D2" },
  business: { bg: "#F1E4C8", text: "#755217", iconBg: "#F1E4C8" },
  misc: { bg: "#E2E0DA", text: "#333A36", iconBg: "#E2E0DA" },
};

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
      { question: "Is my clipboard encrypted?", answer: "Yes. All data transferred is encrypted end-to-end with Web Crypto AES-GCM." },
    ],
    related: ["verify", "qr-generator", "json-formatter"],
  },
};

// ─── NEW MEDIA & LINK DOWNLOADER TOOLS ───
const DOWNLOADER_TOOLS: ToolConfig[] = [
  {
    slug: "universal-downloader",
    name: "Universal Media & Link Downloader",
    category: "video",
    shortDescription: "Download videos, audio, and files from TeraBox, YouTube, Instagram Reels, TikTok, and direct links.",
    keywords: ["media downloader", "video downloader", "download link", "terabox downloader", "youtube mp4", "insta reels download", "tiktok no watermark"],
    faq: [
      { question: "What sites are supported?", answer: "TeraBox, YouTube, Instagram Reels, TikTok (no watermark), Twitter/X, Facebook, and any direct file link." },
      { question: "Can I convert YouTube videos to MP3?", answer: "Yes, choose high quality 320 kbps MP3 or Full HD MP4 video." },
    ],
    related: ["screen-recorder", "video-compress", "audio-trim", "beam"],
    icon: "Download",
    href: "/download",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
  {
    slug: "terabox-downloader",
    name: "TeraBox Link Downloader",
    category: "converters",
    shortDescription: "Extract and download files from TeraBox share links at high speed without account login.",
    keywords: ["terabox downloader", "terabox link bypass", "terabox direct download", "terabox file extractor"],
    faq: [
      { question: "Do I need a TeraBox account?", answer: "No. Paste the shared link to extract the direct high-speed download link." },
    ],
    related: ["universal-downloader", "beam", "archive-extract"],
    icon: "FolderDown",
    href: "/download?platform=terabox",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
  {
    slug: "youtube-downloader",
    name: "YouTube Video & MP3 Downloader",
    category: "video",
    shortDescription: "Save YouTube videos in 1080p Full HD MP4 or extract audio tracks as 320 kbps MP3 files.",
    keywords: ["youtube downloader", "youtube to mp3", "youtube mp4 1080p", "save youtube video"],
    faq: [
      { question: "Can I download audio only?", answer: "Yes, select MP3 Audio for instant sound track extraction." },
    ],
    related: ["universal-downloader", "screen-recorder", "audio-trim"],
    icon: "Video",
    href: "/download?platform=youtube",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
  {
    slug: "instagram-downloader",
    name: "Instagram Reels & Post Downloader",
    category: "video",
    shortDescription: "Download Instagram Reels, carousel photos, stories, and videos in original high resolution.",
    keywords: ["instagram reels download", "insta video saver", "download instagram post", "instagram story saver"],
    faq: [
      { question: "Does it support private accounts?", answer: "Only publicly shared posts and reels can be extracted." },
    ],
    related: ["universal-downloader", "image-to-pdf", "image-compress"],
    icon: "Camera",
    href: "/download?platform=instagram",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
  {
    slug: "tiktok-downloader",
    name: "TikTok Downloader (No Watermark)",
    category: "video",
    shortDescription: "Download clean TikTok videos in HD without the floating watermark logo.",
    keywords: ["tiktok no watermark", "tiktok downloader", "save tiktok video", "tiktok mp3 download"],
    faq: [
      { question: "Are videos free from the TikTok watermark?", answer: "Yes. Raw streams are extracted directly without the overlay watermark." },
    ],
    related: ["universal-downloader", "screen-recorder", "gif-maker"],
    icon: "Music",
    href: "/download?platform=tiktok",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
];

// ─── COMBINE ALL 177 TOOLS WITH CURATED DETAILS & NEW DOWNLOADERS ───
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
    related: curated.related || ["merge-pdf", "compress-pdf", "image-to-pdf", "universal-downloader"],
    icon: t.iconName,
    href: t.href,
    isPopular: t.isPopular || false,
    status: "ready",
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
  shortDescription: "Instantly sync clipboard text, links, and files between your phone and PC with QR pairing.",
  keywords: ["online clipboard", "beam", "phone to pc clipboard", "instant file transfer", "p2p clipboard"],
  faq: [
    { question: "How does Beam pair my devices?", answer: "Scan the on-screen QR code from your phone or enter the 6-character room code on PC." },
    { question: "Is my clipboard encrypted?", answer: "Yes. All data transferred is encrypted end-to-end with Web Crypto AES-GCM." },
  ],
  related: ["verify", "qr-generator", "universal-downloader"],
  icon: "Radio",
  href: "/beam",
  isPopular: true,
  status: "ready",
  isLocal: true,
};

// Deduplicate and assemble full 180+ tools catalog
const toolMap = new Map<string, ToolConfig>();

// Add downloaders first
for (const d of DOWNLOADER_TOOLS) {
  toolMap.set(d.slug, d);
}

// Add Beam
toolMap.set(beamTool.slug, beamTool);

// Add all base tools
for (const t of allBaseTools) {
  if (!toolMap.has(t.slug)) {
    toolMap.set(t.slug, t);
  }
}

export const TOOLS_CONFIG: ToolConfig[] = Array.from(toolMap.values());
