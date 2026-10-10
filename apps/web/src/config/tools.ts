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
  related: string[]; // array of related slugs
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

export const TOOLS_CONFIG: ToolConfig[] = [
  // ─── PDF TOOLS ───
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    shortDescription: "Combine multiple PDF documents into one cleanly organized file in your browser.",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf joiner", "merge pdf online"],
    faq: [
      { question: "Are my PDF files uploaded to a server?", answer: "No. All files are merged 100% locally in your browser memory using WebAssembly." },
      { question: "Is there a limit on how many PDFs I can merge?", answer: "You can merge dozens of files up to 200MB total directly on your device." },
      { question: "Can I reorder pages before merging?", answer: "Yes, you can drag and drop to reorder files and preview pages before downloading." },
    ],
    related: ["split-pdf", "compress-pdf", "image-to-pdf", "pdf-redact", "rotate-pdf", "markdown-to-pdf"],
    icon: "Layers",
    href: "/pdf/merge",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf"],
    outputExtensions: ["pdf"],
    maxFileSizeMB: 100,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    shortDescription: "Extract specific page ranges or burst a PDF into separate single-page documents.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "divide pdf"],
    faq: [
      { question: "Can I extract specific page ranges like 1-3, 5?", answer: "Yes, enter custom page ranges or select individual page thumbnails visually." },
      { question: "Does splitting reduce file quality?", answer: "No. Splitting extracts the original lossless streams with zero degradation." },
    ],
    related: ["merge-pdf", "compress-pdf", "rotate-pdf", "image-to-pdf", "pdf-redact", "ocr-pdf"],
    icon: "Split",
    href: "/pdf/split",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf"],
    outputExtensions: ["pdf"],
    maxFileSizeMB: 100,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    shortDescription: "Reduce PDF file size efficiently while maintaining sharp text and image clarity.",
    keywords: ["compress pdf", "reduce pdf size", "shrink pdf", "smaller pdf file"],
    faq: [
      { question: "How much can I reduce my PDF size?", answer: "Typical savings range from 30% to 80% depending on embedded images and metadata." },
      { question: "Will compressing affect text readability?", answer: "No. Vector text remains crystal sharp while unneeded image bloat is optimized." },
    ],
    related: ["merge-pdf", "split-pdf", "image-to-pdf", "pdf-redact", "ocr-pdf", "pdf-to-jpg"],
    icon: "Minimize2",
    href: "/pdf/compress",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf"],
    outputExtensions: ["pdf"],
    maxFileSizeMB: 100,
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    category: "pdf",
    shortDescription: "Convert JPG, PNG, WEBP, and HEIC images into a single standardized A4 PDF document.",
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photo to pdf", "pictures to pdf"],
    faq: [
      { question: "Can I combine multiple photos into one PDF?", answer: "Yes, upload multiple photos, reorder them, adjust margins, and export as a single PDF." },
      { question: "What image formats are supported?", answer: "JPG, JPEG, PNG, WEBP, BMP, and SVG are all supported." },
    ],
    related: ["pdf-to-jpg", "merge-pdf", "compress-pdf", "ocr-image", "image-compress", "image-resize"],
    icon: "FileImage",
    href: "/image/to-pdf",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["jpg", "jpeg", "png", "webp", "bmp"],
    outputExtensions: ["pdf"],
    maxFileSizeMB: 50,
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    category: "pdf",
    shortDescription: "Convert each page of a PDF document into high-resolution JPG or PNG images.",
    keywords: ["pdf to jpg", "pdf to png", "pdf to image", "convert pdf to picture"],
    faq: [
      { question: "What resolution are the extracted images?", answer: "Rendered at crisp 150-300 DPI for publication and presentation quality." },
    ],
    related: ["image-to-pdf", "merge-pdf", "compress-pdf", "ocr-pdf", "image-compress", "image-crop"],
    icon: "ImageIcon",
    href: "/pdf/to-image",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf"],
    outputExtensions: ["jpg", "png"],
    maxFileSizeMB: 50,
  },
  {
    slug: "pdf-redact",
    name: "Redact PDF",
    category: "pdf",
    shortDescription: "Permanently black out sensitive personal information, account numbers, and private data.",
    keywords: ["redact pdf", "black out pdf", "censor pdf", "remove sensitive pdf text"],
    faq: [
      { question: "Is this true cryptographic redaction?", answer: "Yes. The underlying text and image vectors under the redaction box are completely erased." },
    ],
    related: ["merge-pdf", "split-pdf", "compress-pdf", "ocr-pdf", "draw-signature", "verify"],
    icon: "ShieldAlert",
    href: "/pdf/redact",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf"],
    outputExtensions: ["pdf"],
    maxFileSizeMB: 50,
  },
  {
    slug: "ocr-image",
    name: "Image OCR",
    category: "text",
    shortDescription: "Extract editable text from scanned documents, receipts, screenshots, and photos locally.",
    keywords: ["image ocr", "extract text from image", "photo to text", "scan receipt to text"],
    faq: [
      { question: "Does OCR require an internet connection?", answer: "No. The OCR engine runs locally in your browser using WebAssembly." },
    ],
    related: ["ocr-pdf", "image-to-pdf", "ai-summarize", "diff-checker", "markdown-to-pdf", "invoice-generator"],
    icon: "ScanText",
    href: "/ocr/image",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["jpg", "png", "webp"],
    outputExtensions: ["txt", "json"],
    maxFileSizeMB: 30,
  },
  {
    slug: "ai-summarize",
    name: "Document Summarizer",
    category: "text",
    shortDescription: "Generate concise executive summaries, key bullet takeaways, and metrics from long documents.",
    keywords: ["ai document summarizer", "summarize pdf", "tldr document", "text summary"],
    faq: [
      { question: "How does the summarizer work?", answer: "It analyzes text hierarchy, sentence importance, and semantic frequency directly in memory." },
    ],
    related: ["ocr-image", "ai-chat", "markdown-to-pdf", "ai-transcribe", "diff-checker", "word-counter"],
    icon: "Sparkles",
    href: "/ai/summarize",
    isPopular: true,
    status: "ready",
    isLocal: true,
    inputExtensions: ["pdf", "txt", "docx", "md"],
    outputExtensions: ["txt", "md"],
    maxFileSizeMB: 20,
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    category: "business",
    shortDescription: "Create clean, professional A4 PDF invoices and receipts with instant client calculation.",
    keywords: ["invoice generator", "free invoice maker", "create receipt pdf", "freelance bill generator"],
    faq: [
      { question: "Can I add my business logo and currency?", answer: "Yes, customize logo, tax rates, currency symbol, line items, and payment notes." },
    ],
    related: ["receipt-generator", "draw-signature", "type-signature", "merge-pdf", "verify", "qr-generator"],
    icon: "Receipt",
    href: "/business/invoice",
    isPopular: true,
    status: "ready",
    isLocal: true,
    outputExtensions: ["pdf"],
    maxFileSizeMB: 10,
  },
  {
    slug: "screen-recorder",
    name: "Screen Recorder",
    category: "video",
    shortDescription: "Record your screen, browser window, or webcam with microphone audio directly to WebM/MP4.",
    keywords: ["screen recorder online", "record monitor", "browser screen capture", "record audio video"],
    faq: [
      { question: "Is there a recording watermark or time limit?", answer: "No watermarks, no software downloads, and no limits on recording duration." },
    ],
    related: ["ai-transcribe", "text-to-speech", "video-compress", "audio-trim", "gif-maker", "svg-viewer"],
    icon: "Video",
    href: "/misc/screen-record",
    isPopular: true,
    status: "ready",
    isLocal: true,
    outputExtensions: ["webm", "mp4"],
    maxFileSizeMB: 500,
  },
  {
    slug: "beam",
    name: "Beam Live Clipboard",
    category: "misc",
    shortDescription: "Instantly sync clipboard text, links, and files between your phone and PC with QR pairing.",
    keywords: ["online clipboard", "beam", "phone to pc clipboard", "instant file transfer", "p2p clipboard"],
    faq: [
      { question: "How does Beam pair my devices?", answer: "Scan the on-screen QR code from your phone or enter the 6-character room code on PC." },
      { question: "Is my clipboard encrypted?", answer: "Yes. All data transferred is encrypted end-to-end and stored strictly in temporary session memory." },
    ],
    related: ["quicksend-transfer", "verify", "qr-generator", "json-formatter", "base64", "markdown-to-pdf"],
    icon: "Radio",
    href: "/beam",
    isPopular: true,
    status: "ready",
    isLocal: true,
  },
];
