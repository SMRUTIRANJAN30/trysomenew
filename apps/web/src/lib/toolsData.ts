export type ToolStatus = "ready" | "coming_soon";
export type ToolCategory =
  | "pdf"
  | "pdf-convert"
  | "pdf-edit"
  | "pdf-security"
  | "pdf-organize"
  | "watermark-stamp"
  | "signature-verify"
  | "ocr-scan"
  | "ai-document"
  | "ai-general"
  | "ai-audio"
  | "ai-video"
  | "image"
  | "color"
  | "svg"
  | "audio"
  | "video"
  | "gif"
  | "media-download"
  | "archive"
  | "developer"
  | "web"
  | "text"
  | "calculator"
  | "qr"
  | "barcode"
  | "clipboard"
  | "transfer"
  | "device"
  | "security-privacy"
  | "workflow"
  | "cloud"
  | "business"
  | "education"
  | "print"
  | "spreadsheet"
  | "document"
  | "misc";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  href: string;
  isPopular?: boolean;
  status: ToolStatus;
  isLocal: boolean;
  tags: string[];
  inputExtensions?: string[];
  outputExtensions?: string[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  "pdf": "PDF Management",
  "pdf-convert": "PDF Conversion",
  "pdf-edit": "PDF Editor",
  "pdf-security": "PDF Security",
  "pdf-organize": "PDF Organize",
  "watermark-stamp": "Watermark & Stamp",
  "signature-verify": "Signature & Verification",
  "ocr-scan": "OCR & Scanning",
  "ai-document": "AI Document Tools",
  "ai-general": "AI General Tools",
  "ai-audio": "AI Audio Tools",
  "ai-video": "AI Video Tools",
  "image": "Image Tools",
  "color": "Color Tools",
  "svg": "SVG Tools",
  "audio": "Audio Tools",
  "video": "Video Tools",
  "gif": "GIF Tools",
  "media-download": "Media Downloader",
  "archive": "Archive & File",
  "developer": "Developer Tools",
  "web": "Web Tools",
  "text": "Text Tools",
  "calculator": "Calculators",
  "qr": "QR Tools",
  "barcode": "Barcode Tools",
  "clipboard": "Clipboard",
  "transfer": "File Transfer",
  "device": "Device Tools",
  "security-privacy": "Security & Privacy",
  "workflow": "Workflow Automation",
  "cloud": "Cloud & Sharing",
  "business": "Business Tools",
  "education": "Education Tools",
  "print": "Print & Layout",
  "spreadsheet": "Spreadsheet Tools",
  "document": "Document Creator",
  "misc": "Miscellaneous",
};

export const COMMON_EXTENSIONS: { ext: string; label: string; icon: string }[] = [
  { ext: "pdf", label: "PDF", icon: "📄" },
  { ext: "png", label: "PNG", icon: "🖼️" },
  { ext: "jpg", label: "JPG", icon: "📷" },
  { ext: "docx", label: "DOCX", icon: "📝" },
  { ext: "xlsx", label: "XLSX", icon: "📊" },
  { ext: "mp4", label: "MP4", icon: "🎬" },
  { ext: "mp3", label: "MP3", icon: "🎵" },
  { ext: "zip", label: "ZIP", icon: "📦" },
  { ext: "svg", label: "SVG", icon: "🌐" },
  { ext: "json", label: "JSON", icon: "⚙️" },
  { ext: "csv", label: "CSV", icon: "📑" },
];

export const KNOWN_EXTENSIONS_SET = new Set([
  "pdf", "png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "tiff", "heic",
  "docx", "doc", "pptx", "ppt", "xlsx", "xls", "txt", "rtf", "odt", "ods", "odp",
  "mp4", "webm", "mov", "avi", "mkv", "mp3", "wav", "aac", "flac", "ogg", "m4a",
  "zip", "tar", "gz", "7z", "json", "csv", "xml", "yaml", "yml", "html", "css", "js", "sql", "md", "epub"
]);

/**
 * Returns true if the query is asking for a specific file format extension (e.g. "png", ".png", "pdf")
 */
export function detectExtensionQuery(query: string): string | null {
  const clean = query.trim().toLowerCase().replace(/^\./, "");
  if (KNOWN_EXTENSIONS_SET.has(clean)) {
    if (clean === "jpeg") return "jpg";
    if (clean === "doc") return "docx";
    if (clean === "xls") return "xlsx";
    if (clean === "ppt") return "pptx";
    return clean;
  }
  return null;
}

export const TOOLS: ToolDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // PDF MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one document with reorderable pages and A4 option.", category: "pdf", iconName: "Layers", href: "/pdf/merge", isPopular: true, status: "ready", isLocal: true, tags: ["merge", "combine", "join", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "split-pdf", name: "Split PDF", description: "Extract pages or burst a PDF into individual files.", category: "pdf", iconName: "Split", href: "/pdf/split", isPopular: true, status: "ready", isLocal: true, tags: ["split", "extract", "burst", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate pages 90°, 180°, or 270° with live preview.", category: "pdf", iconName: "RotateCw", href: "/pdf/rotate", isPopular: true, status: "ready", isLocal: true, tags: ["rotate", "orientation", "flip", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size with multiple quality presets.", category: "pdf", iconName: "Minimize2", href: "/pdf/compress", isPopular: true, status: "ready", isLocal: true, tags: ["compress", "shrink", "optimize", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-metadata", name: "PDF Viewer & Metadata", description: "Inspect page geometry, author, title, and edit document properties.", category: "pdf", iconName: "FileSearch", href: "/pdf/view", status: "ready", isLocal: true, tags: ["view", "metadata", "inspect", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "extract-pages", name: "Extract PDF Pages", description: "Pull specific pages from a document into a new PDF.", category: "pdf", iconName: "FileMinus", href: "/pdf/split", status: "ready", isLocal: true, tags: ["extract", "pages", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "delete-pages", name: "Delete PDF Pages", description: "Remove unwanted pages from a PDF document.", category: "pdf", iconName: "Trash2", href: "/pdf/split", status: "ready", isLocal: true, tags: ["delete", "remove", "pages", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "rearrange-pages", name: "Rearrange PDF Pages", description: "Drag-and-drop page reordering for any PDF.", category: "pdf", iconName: "GripVertical", href: "/pdf/merge", status: "ready", isLocal: true, tags: ["rearrange", "reorder", "pages", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "rotate-pages", name: "Rotate PDF Pages", description: "Rotate individual or all pages by a custom angle.", category: "pdf", iconName: "RotateCw", href: "/pdf/rotate", status: "ready", isLocal: true, tags: ["rotate", "pages", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-page-numbers", name: "PDF Page Numbers", description: "Add page numbers to header or footer with custom formatting.", category: "pdf", iconName: "Hash", href: "/pdf/page-numbers", status: "ready", isLocal: true, tags: ["page numbers", "numbering", "footer", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-header-footer", name: "PDF Header & Footer", description: "Add custom header and footer text to every page.", category: "pdf", iconName: "AlignCenter", href: "/pdf/header-footer", status: "ready", isLocal: true, tags: ["header", "footer", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "split-half", name: "Split PDF in Half", description: "Automatically divide a PDF into two equal parts.", category: "pdf", iconName: "SplitSquareHorizontal", href: "/pdf/split", status: "ready", isLocal: true, tags: ["split", "half", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-compare", name: "PDF Compare", description: "Side-by-side and visual difference comparison of two PDFs.", category: "pdf", iconName: "Columns2", href: "/pdf/compare", status: "coming_soon", isLocal: true, tags: ["compare", "diff", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-repair", name: "PDF Repair", description: "Attempt to recover and rebuild damaged or corrupted PDFs.", category: "pdf", iconName: "Wrench", href: "/pdf/repair", status: "coming_soon", isLocal: false, tags: ["repair", "fix", "corrupt", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },

  // ─────────────────────────────────────────────────────────────────────────
  // PDF CONVERSION
  // ─────────────────────────────────────────────────────────────────────────
  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to high-resolution JPG images.", category: "pdf-convert", iconName: "Image", href: "/pdf/to-image", isPopular: true, status: "ready", isLocal: true, tags: ["pdf to jpg", "convert", "image"], inputExtensions: ["pdf"], outputExtensions: ["jpg", "jpeg"] },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Convert PDF pages to lossless PNG images.", category: "pdf-convert", iconName: "Image", href: "/pdf/to-image", isPopular: true, status: "ready", isLocal: true, tags: ["pdf to png", "convert", "image"], inputExtensions: ["pdf"], outputExtensions: ["png"] },
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to editable DOCX format.", category: "pdf-convert", iconName: "FileText", href: "/convert/pdf-to-docx", isPopular: true, status: "coming_soon", isLocal: false, tags: ["pdf to word", "docx", "convert"], inputExtensions: ["pdf"], outputExtensions: ["docx", "doc"] },
  { id: "pdf-to-ppt", name: "PDF to PowerPoint", description: "Convert PDF slides to editable PPTX.", category: "pdf-convert", iconName: "Presentation", href: "/convert/pdf-to-pptx", status: "coming_soon", isLocal: false, tags: ["pdf to ppt", "pptx", "convert"], inputExtensions: ["pdf"], outputExtensions: ["pptx", "ppt"] },
  { id: "pdf-to-excel", name: "PDF to Excel", description: "Extract tables and data from PDF into XLSX.", category: "pdf-convert", iconName: "Table", href: "/convert/pdf-to-xlsx", status: "coming_soon", isLocal: false, tags: ["pdf to excel", "xlsx", "convert"], inputExtensions: ["pdf"], outputExtensions: ["xlsx", "xls"] },
  { id: "pdf-to-txt", name: "PDF to TXT", description: "Extract all text from a PDF document.", category: "pdf-convert", iconName: "FileText", href: "/convert/pdf-to-txt", status: "coming_soon", isLocal: false, tags: ["pdf to text", "extract text", "convert"], inputExtensions: ["pdf"], outputExtensions: ["txt"] },
  { id: "pdf-to-html", name: "PDF to HTML", description: "Convert PDF to an accessible HTML webpage.", category: "pdf-convert", iconName: "Code2", href: "/convert/pdf-to-html", status: "coming_soon", isLocal: false, tags: ["pdf to html", "convert"], inputExtensions: ["pdf"], outputExtensions: ["html"] },
  { id: "pdf-to-markdown", name: "PDF to Markdown", description: "Extract structured Markdown content from PDF.", category: "pdf-convert", iconName: "FileCode", href: "/convert/pdf-to-markdown", status: "coming_soon", isLocal: false, tags: ["pdf to markdown", "convert"], inputExtensions: ["pdf"], outputExtensions: ["md"] },
  { id: "pdf-to-epub", name: "PDF to EPUB", description: "Convert PDF books to e-reader EPUB format.", category: "pdf-convert", iconName: "BookOpen", href: "/convert/pdf-to-epub", status: "coming_soon", isLocal: false, tags: ["pdf to epub", "ebook", "convert"], inputExtensions: ["pdf"], outputExtensions: ["epub"] },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert DOCX Word documents to PDF.", category: "pdf-convert", iconName: "FileText", href: "/convert/docx-to-pdf", status: "coming_soon", isLocal: false, tags: ["word to pdf", "docx", "convert"], inputExtensions: ["docx", "doc"], outputExtensions: ["pdf"] },
  { id: "ppt-to-pdf", name: "PowerPoint to PDF", description: "Convert PPTX presentations to PDF.", category: "pdf-convert", iconName: "Presentation", href: "/convert/pptx-to-pdf", status: "coming_soon", isLocal: false, tags: ["ppt to pdf", "pptx", "convert"], inputExtensions: ["pptx", "ppt"], outputExtensions: ["pdf"] },
  { id: "excel-to-pdf", name: "Excel to PDF", description: "Convert XLSX spreadsheets to PDF.", category: "pdf-convert", iconName: "Table", href: "/convert/xlsx-to-pdf", status: "coming_soon", isLocal: false, tags: ["excel to pdf", "xlsx", "convert"], inputExtensions: ["xlsx", "xls"], outputExtensions: ["pdf"] },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF document with A4 options.", category: "pdf-convert", iconName: "Image", href: "/image/to-pdf", status: "ready", isLocal: true, tags: ["jpg to pdf", "image to pdf", "convert"], inputExtensions: ["jpg", "jpeg"], outputExtensions: ["pdf"] },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images to PDF document with A4 options.", category: "pdf-convert", iconName: "Image", href: "/image/to-pdf", status: "ready", isLocal: true, tags: ["png to pdf", "image to pdf", "convert"], inputExtensions: ["png"], outputExtensions: ["pdf"] },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert a webpage or HTML file to PDF.", category: "pdf-convert", iconName: "Globe", href: "/convert/html-to-pdf", status: "coming_soon", isLocal: false, tags: ["html to pdf", "webpage", "convert"], inputExtensions: ["html"], outputExtensions: ["pdf"] },
  { id: "markdown-to-pdf", name: "Markdown to PDF", description: "Render Markdown as a styled PDF document.", category: "pdf-convert", iconName: "FileCode", href: "/convert/markdown-to-pdf", status: "coming_soon", isLocal: false, tags: ["markdown to pdf", "convert"], inputExtensions: ["md"], outputExtensions: ["pdf"] },

  // ─────────────────────────────────────────────────────────────────────────
  // PDF EDITOR
  // ─────────────────────────────────────────────────────────────────────────
  { id: "pdf-editor", name: "PDF Editor", description: "Full browser-based PDF editor with text, images, annotations.", category: "pdf-edit", iconName: "PenTool", href: "/pdf/editor", status: "coming_soon", isLocal: true, tags: ["edit", "editor", "annotate", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-watermark", name: "PDF Watermark", description: "Add text or image watermarks to PDF pages.", category: "watermark-stamp", iconName: "Droplets", href: "/pdf/watermark", status: "ready", isLocal: true, tags: ["watermark", "stamp", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-page-numbers-tool", name: "Add Page Numbers", description: "Insert formatted page numbers into PDF.", category: "pdf-edit", iconName: "Hash", href: "/pdf/page-numbers", status: "ready", isLocal: true, tags: ["page numbers", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },

  // ─────────────────────────────────────────────────────────────────────────
  // PDF SECURITY
  // ─────────────────────────────────────────────────────────────────────────
  { id: "protect-pdf", name: "Protect PDF", description: "Add password protection and encryption to PDF.", category: "pdf-security", iconName: "Lock", href: "/pdf/protect", status: "coming_soon", isLocal: true, tags: ["protect", "password", "encrypt", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Remove password from authorized PDF files.", category: "pdf-security", iconName: "Unlock", href: "/pdf/unlock", status: "coming_soon", isLocal: true, tags: ["unlock", "decrypt", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-redact", name: "PDF Redaction", description: "Permanently black out sensitive text and images.", category: "pdf-security", iconName: "EyeOff", href: "/pdf/redact", status: "coming_soon", isLocal: true, tags: ["redact", "hide", "secure", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "pdf-metadata-remove", name: "Remove PDF Metadata", description: "Strip author, creator, and hidden metadata from PDF.", category: "pdf-security", iconName: "Eraser", href: "/pdf/view", status: "ready", isLocal: true, tags: ["metadata", "remove", "privacy", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "flatten-pdf", name: "Flatten PDF", description: "Flatten annotations and form fields permanently.", category: "pdf-security", iconName: "Layers", href: "/pdf/flatten", status: "coming_soon", isLocal: true, tags: ["flatten", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNATURE & VERIFICATION
  // ─────────────────────────────────────────────────────────────────────────
  { id: "document-verification", name: "Cryptographic Verification", description: "SHA-256 integrity hash, Document IDs, and tamper audit.", category: "signature-verify", iconName: "ShieldCheck", href: "/verify", isPopular: true, status: "ready", isLocal: true, tags: ["verify", "sha256", "hash", "integrity"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "sha256-hash", name: "SHA-256 File Hash", description: "Compute the SHA-256 cryptographic digest of any file.", category: "signature-verify", iconName: "Hash", href: "/verify", status: "ready", isLocal: true, tags: ["sha256", "hash", "checksum", "file"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "file-hash", name: "File Hash Generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 with visual part inspection.", category: "security-privacy", iconName: "Hash", href: "/security/hash-file", status: "ready", isLocal: true, tags: ["hash", "md5", "sha1", "sha256", "checksum"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "qr-doc-verify", name: "QR Document Verification", description: "Generate a QR code linking to a document's verification page.", category: "signature-verify", iconName: "QrCode", href: "/verify", status: "ready", isLocal: true, tags: ["qr", "verify", "document"], inputExtensions: ["*"], outputExtensions: ["png", "svg"] },
  { id: "draw-signature", name: "Draw Signature", description: "Hand-draw a signature with mouse or touch.", category: "signature-verify", iconName: "PenTool", href: "/sign/draw", status: "coming_soon", isLocal: true, tags: ["signature", "draw", "sign"], inputExtensions: [], outputExtensions: ["png", "svg"] },
  { id: "type-signature", name: "Type Signature", description: "Generate a typed signature in handwriting fonts.", category: "signature-verify", iconName: "Type", href: "/sign/type", status: "coming_soon", isLocal: true, tags: ["signature", "type", "sign"], inputExtensions: [], outputExtensions: ["png", "svg"] },

  // ─────────────────────────────────────────────────────────────────────────
  // OCR & SCANNING
  // ─────────────────────────────────────────────────────────────────────────
  { id: "ocr-pdf", name: "OCR PDF", description: "Convert scanned PDF to searchable text document.", category: "ocr-scan", iconName: "ScanText", href: "/ocr/pdf", status: "coming_soon", isLocal: false, tags: ["ocr", "scan", "searchable", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf", "txt"] },
  { id: "ocr-image", name: "OCR Image", description: "Extract text from photos and scanned images.", category: "ocr-scan", iconName: "ScanLine", href: "/ocr/image", status: "coming_soon", isLocal: false, tags: ["ocr", "image to text", "scan"], inputExtensions: ["png", "jpg", "jpeg", "webp", "bmp"], outputExtensions: ["txt", "docx"] },
  { id: "document-scanner", name: "Document Scanner", description: "Use your phone camera to scan documents to PDF.", category: "ocr-scan", iconName: "Scan", href: "/scanner", status: "coming_soon", isLocal: true, tags: ["scan", "scanner", "camera", "mobile"], inputExtensions: [], outputExtensions: ["pdf"] },

  // ─────────────────────────────────────────────────────────────────────────
  // AI DOCUMENT TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "ai-summarizer", name: "AI PDF Summarizer", description: "Auto-summarize long PDFs with key sections and insights.", category: "ai-document", iconName: "Sparkles", href: "/ai/summarize", isPopular: true, status: "coming_soon", isLocal: false, tags: ["ai", "summarize", "pdf", "summarizer"], inputExtensions: ["pdf", "docx"], outputExtensions: ["txt", "md"] },
  { id: "ai-chat-pdf", name: "Chat with PDF", description: "Ask questions about any document with page citations.", category: "ai-document", iconName: "MessageSquare", href: "/ai/chat", isPopular: true, status: "coming_soon", isLocal: false, tags: ["ai", "chat", "pdf", "qa", "ask"], inputExtensions: ["pdf"], outputExtensions: [] },
  { id: "ai-translator", name: "AI Document Translator", description: "Translate PDF and documents while preserving layout.", category: "ai-document", iconName: "Languages", href: "/ai/translate", status: "coming_soon", isLocal: false, tags: ["ai", "translate", "pdf", "translator"], inputExtensions: ["pdf", "docx"], outputExtensions: ["pdf", "docx"] },
  { id: "ai-data-extractor", name: "AI Data Extractor", description: "Extract structured data (tables, invoices, entities) from documents.", category: "ai-document", iconName: "Database", href: "/ai/extract", status: "coming_soon", isLocal: false, tags: ["ai", "extract", "table", "invoice", "data"], inputExtensions: ["pdf", "png", "jpg"], outputExtensions: ["json", "csv", "xlsx"] },
  { id: "ai-flashcards", name: "AI Flashcard Generator", description: "Auto-generate study flashcards from any document.", category: "ai-document", iconName: "BookOpen", href: "/ai/flashcards", status: "coming_soon", isLocal: false, tags: ["ai", "flashcards", "study", "education"], inputExtensions: ["pdf", "docx", "txt"], outputExtensions: ["json"] },
  { id: "ai-quiz", name: "AI Quiz Generator", description: "Generate MCQs and quiz questions from documents.", category: "ai-document", iconName: "HelpCircle", href: "/ai/quiz", status: "coming_soon", isLocal: false, tags: ["ai", "quiz", "mcq", "education"], inputExtensions: ["pdf", "docx", "txt"], outputExtensions: ["json"] },
  { id: "ai-presentation", name: "PDF to Presentation", description: "AI-generate a PPTX presentation from a research paper or report.", category: "ai-document", iconName: "Presentation", href: "/ai/presentation", status: "coming_soon", isLocal: false, tags: ["ai", "presentation", "pptx", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pptx"] },
  { id: "ai-smart-split", name: "AI Smart Split", description: "Intelligently split documents by topic, chapter, or content boundaries.", category: "ai-document", iconName: "Scissors", href: "/ai/smart-split", status: "coming_soon", isLocal: false, tags: ["ai", "smart split", "pdf"], inputExtensions: ["pdf"], outputExtensions: ["pdf"] },
  { id: "ai-smart-rename", name: "AI Smart Rename", description: "Rename files automatically based on their contents.", category: "ai-document", iconName: "Tag", href: "/ai/smart-rename", status: "coming_soon", isLocal: false, tags: ["ai", "rename", "smart", "classify"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "ai-contract", name: "AI Contract Analyzer", description: "Extract key clauses, parties, dates, and risks from contracts.", category: "ai-document", iconName: "FileCheck", href: "/ai/contract", status: "coming_soon", isLocal: false, tags: ["ai", "contract", "legal", "analyze"], inputExtensions: ["pdf", "docx"], outputExtensions: ["json", "md"] },

  // ─────────────────────────────────────────────────────────────────────────
  // IMAGE TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "image-compress", name: "Image Compressor", description: "Reduce image file sizes with quality control.", category: "image", iconName: "Minimize2", href: "/image/compress", isPopular: true, status: "ready", isLocal: true, tags: ["image", "compress", "jpg", "png", "webp"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "image-resize", name: "Image Resizer", description: "Resize images to exact pixel dimensions or percentages.", category: "image", iconName: "Scaling", href: "/image/resize", isPopular: true, status: "ready", isLocal: true, tags: ["image", "resize", "scale", "dimensions"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "image-crop", name: "Image Cropper", description: "Crop images to custom aspect ratios or exact coordinates.", category: "image", iconName: "Crop", href: "/image/crop", status: "ready", isLocal: true, tags: ["image", "crop", "trim"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "image-rotate", name: "Image Rotator", description: "Rotate images 90°, 180°, or 270°.", category: "image", iconName: "RotateCw", href: "/image/rotate", status: "ready", isLocal: true, tags: ["image", "rotate", "orientation"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "image-grayscale", name: "Image Grayscale & Clean BG", description: "Convert color images to black and white or clean dark backgrounds.", category: "image", iconName: "Circle", href: "/image/filters", status: "ready", isLocal: true, tags: ["image", "grayscale", "black white", "clean background"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp"] },
  { id: "image-convert", name: "Image Converter", description: "Convert between JPG, PNG, WebP, BMP, TIFF, GIF formats.", category: "image", iconName: "RefreshCw", href: "/image/convert", isPopular: true, status: "ready", isLocal: true, tags: ["image", "convert", "jpg", "png", "webp"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "jpg-to-png", name: "JPG to PNG", description: "Convert JPG images to lossless PNG.", category: "image", iconName: "Image", href: "/image/convert", status: "ready", isLocal: true, tags: ["jpg to png", "convert"], inputExtensions: ["jpg", "jpeg"], outputExtensions: ["png"] },
  { id: "png-to-jpg", name: "PNG to JPG", description: "Convert PNG to compact JPG format.", category: "image", iconName: "Image", href: "/image/convert", status: "ready", isLocal: true, tags: ["png to jpg", "convert"], inputExtensions: ["png"], outputExtensions: ["jpg", "jpeg"] },
  { id: "webp-to-jpg", name: "WebP to JPG", description: "Convert WebP to JPG for maximum compatibility.", category: "image", iconName: "Image", href: "/image/convert", status: "ready", isLocal: true, tags: ["webp to jpg", "convert"], inputExtensions: ["webp"], outputExtensions: ["jpg", "jpeg"] },
  { id: "heic-to-jpg", name: "HEIC to JPG", description: "Convert Apple HEIC photos to standard JPG.", category: "image", iconName: "Smartphone", href: "/image/heic", status: "coming_soon", isLocal: false, tags: ["heic to jpg", "apple", "iphone", "convert"], inputExtensions: ["heic"], outputExtensions: ["jpg", "jpeg"] },
  { id: "image-watermark", name: "Image Watermark", description: "Add text or logo watermarks to images.", category: "image", iconName: "Droplets", href: "/image/watermark", status: "ready", isLocal: true, tags: ["image", "watermark"], inputExtensions: ["png", "jpg", "jpeg", "webp"], outputExtensions: ["png", "jpg", "jpeg", "webp"] },
  { id: "image-to-pdf", name: "Images to PDF", description: "Combine multiple images into standard A4 PDF with B&W background cleaning.", category: "image", iconName: "FileText", href: "/image/to-pdf", isPopular: true, status: "ready", isLocal: true, tags: ["image to pdf", "jpg to pdf", "png to pdf", "a4"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp", "svg"], outputExtensions: ["pdf"] },
  { id: "image-optimizer", name: "Image Optimizer", description: "Smart optimization for web with quality/size balance.", category: "image", iconName: "Zap", href: "/image/compress", status: "ready", isLocal: true, tags: ["image", "optimize", "web"], inputExtensions: ["png", "jpg", "jpeg", "webp"], outputExtensions: ["png", "jpg", "jpeg", "webp"] },
  { id: "batch-image-convert", name: "Batch Image Converter", description: "Convert multiple images at once to any format.", category: "image", iconName: "Layers", href: "/image/convert", status: "ready", isLocal: true, tags: ["batch", "image", "convert"], inputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"], outputExtensions: ["png", "jpg", "jpeg", "webp", "gif", "bmp"] },
  { id: "image-bg-remove", name: "Background Remover", description: "AI-powered background removal for images.", category: "image", iconName: "Scissors", href: "/image/bg-remove", status: "coming_soon", isLocal: false, tags: ["background remove", "ai", "image"], inputExtensions: ["png", "jpg", "jpeg", "webp"], outputExtensions: ["png"] },

  // ─────────────────────────────────────────────────────────────────────────
  // COLOR TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "color-converter", name: "Color Converter", description: "Convert between HEX, RGB, HSL, HSV, CMYK color formats.", category: "color", iconName: "Palette", href: "/color/converter", isPopular: true, status: "ready", isLocal: true, tags: ["color", "hex", "rgb", "hsl", "convert"], inputExtensions: [], outputExtensions: [] },
  { id: "color-picker", name: "Color Picker", description: "Pick colors visually from any palette or enter values.", category: "color", iconName: "Pipette", href: "/color/picker", status: "ready", isLocal: true, tags: ["color", "picker", "hex"], inputExtensions: [], outputExtensions: [] },
  { id: "color-palette", name: "Color Palette Generator", description: "Generate complementary, analogous, and triadic palettes.", category: "color", iconName: "Swatch", href: "/color/palette", status: "ready", isLocal: true, tags: ["color", "palette", "generate"], inputExtensions: [], outputExtensions: [] },
  { id: "contrast-checker", name: "WCAG Contrast Checker", description: "Verify color contrast ratios for accessibility compliance.", category: "color", iconName: "Sun", href: "/color/contrast", status: "ready", isLocal: true, tags: ["contrast", "wcag", "accessibility", "color"], inputExtensions: [], outputExtensions: [] },
  { id: "gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients with live preview.", category: "color", iconName: "Sparkles", href: "/color/gradient", status: "ready", isLocal: true, tags: ["gradient", "css", "color"], inputExtensions: [], outputExtensions: [] },

  // ─────────────────────────────────────────────────────────────────────────
  // SVG TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "svg-viewer", name: "SVG Viewer", description: "View, inspect, and preview SVG files in browser.", category: "svg", iconName: "Eye", href: "/svg/viewer", status: "ready", isLocal: true, tags: ["svg", "view", "preview"], inputExtensions: ["svg"], outputExtensions: [] },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Remove unnecessary data and minify SVG files.", category: "svg", iconName: "Minimize2", href: "/svg/optimize", status: "ready", isLocal: true, tags: ["svg", "optimize", "minify", "compress"], inputExtensions: ["svg"], outputExtensions: ["svg"] },
  { id: "svg-to-png", name: "SVG to PNG", description: "Convert vector SVG to high-resolution PNG.", category: "svg", iconName: "Image", href: "/svg/convert", status: "ready", isLocal: true, tags: ["svg to png", "convert", "vector"], inputExtensions: ["svg"], outputExtensions: ["png"] },
  { id: "svg-to-pdf", name: "SVG to PDF", description: "Convert SVG vector graphics to PDF.", category: "svg", iconName: "FileText", href: "/svg/convert", status: "ready", isLocal: true, tags: ["svg to pdf", "convert"], inputExtensions: ["svg"], outputExtensions: ["pdf"] },
  { id: "svg-to-data-uri", name: "SVG to Data URI", description: "Convert SVG to inline base64 Data URI for CSS/HTML.", category: "svg", iconName: "Code2", href: "/svg/data-uri", status: "ready", isLocal: true, tags: ["svg", "data uri", "base64", "css"], inputExtensions: ["svg"], outputExtensions: ["txt"] },

  // ─────────────────────────────────────────────────────────────────────────
  // AUDIO TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "audio-convert", name: "Audio Converter", description: "Convert between MP3, WAV, AAC, FLAC, OGG, M4A formats.", category: "audio", iconName: "Music", href: "/audio/convert", status: "coming_soon", isLocal: false, tags: ["audio", "mp3", "wav", "convert", "flac"], inputExtensions: ["mp3", "wav", "aac", "flac", "ogg", "m4a"], outputExtensions: ["mp3", "wav", "aac", "flac", "ogg", "m4a"] },
  { id: "audio-compress", name: "Audio Compressor", description: "Reduce audio file size while preserving quality.", category: "audio", iconName: "Minimize2", href: "/audio/compress", status: "coming_soon", isLocal: false, tags: ["audio", "compress", "mp3"], inputExtensions: ["mp3", "wav", "m4a"], outputExtensions: ["mp3"] },
  { id: "audio-trim", name: "Audio Trimmer", description: "Cut and trim audio files to exact durations.", category: "audio", iconName: "Scissors", href: "/audio/trim", status: "coming_soon", isLocal: false, tags: ["audio", "trim", "cut"], inputExtensions: ["mp3", "wav", "m4a", "ogg"], outputExtensions: ["mp3", "wav"] },
  { id: "audio-merge", name: "Audio Merger", description: "Join multiple audio files into a single track.", category: "audio", iconName: "Layers", href: "/audio/merge", status: "coming_soon", isLocal: false, tags: ["audio", "merge", "join"], inputExtensions: ["mp3", "wav"], outputExtensions: ["mp3"] },
  { id: "audio-to-text", name: "Audio to Text", description: "Transcribe audio recordings to text.", category: "ai-audio", iconName: "Mic", href: "/ai/transcribe", status: "coming_soon", isLocal: false, tags: ["audio", "transcribe", "speech to text", "ai"], inputExtensions: ["mp3", "wav", "m4a"], outputExtensions: ["txt", "docx"] },
  { id: "text-to-speech", name: "Text to Speech", description: "Convert text to natural-sounding audio.", category: "ai-audio", iconName: "Volume2", href: "/ai/tts", status: "coming_soon", isLocal: false, tags: ["text to speech", "tts", "ai", "voice"], inputExtensions: ["txt"], outputExtensions: ["mp3"] },

  // ─────────────────────────────────────────────────────────────────────────
  // VIDEO TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "video-compress", name: "Video Compressor", description: "Reduce MP4, MOV, AVI, MKV file sizes significantly.", category: "video", iconName: "Film", href: "/video/compress", status: "coming_soon", isLocal: false, tags: ["video", "compress", "mp4", "reduce size"], inputExtensions: ["mp4", "webm", "mov", "avi", "mkv"], outputExtensions: ["mp4", "webm"] },
  { id: "video-convert", name: "Video Converter", description: "Convert between MP4, MOV, AVI, MKV, WebM.", category: "video", iconName: "RefreshCw", href: "/video/convert", status: "coming_soon", isLocal: false, tags: ["video", "convert", "mp4", "webm"], inputExtensions: ["mp4", "webm", "mov", "avi", "mkv"], outputExtensions: ["mp4", "webm"] },
  { id: "video-trim", name: "Video Trimmer", description: "Cut and trim videos to exact time ranges.", category: "video", iconName: "Scissors", href: "/video/trim", status: "coming_soon", isLocal: false, tags: ["video", "trim", "cut"], inputExtensions: ["mp4", "webm", "mov"], outputExtensions: ["mp4", "webm"] },
  { id: "video-merge", name: "Video Merger", description: "Concatenate and join multiple video files.", category: "video", iconName: "Layers", href: "/video/merge", status: "coming_soon", isLocal: false, tags: ["video", "merge", "join"], inputExtensions: ["mp4", "webm", "mov"], outputExtensions: ["mp4"] },
  { id: "video-to-gif", name: "Video to GIF", description: "Convert video clips into animated GIF files.", category: "video", iconName: "Clapperboard", href: "/video/to-gif", status: "coming_soon", isLocal: false, tags: ["video to gif", "convert", "gif"], inputExtensions: ["mp4", "webm", "mov"], outputExtensions: ["gif"] },
  { id: "video-to-audio", name: "Video to Audio", description: "Extract audio track from any video file.", category: "video", iconName: "Music", href: "/video/extract-audio", status: "coming_soon", isLocal: false, tags: ["video to audio", "extract audio", "mp3"], inputExtensions: ["mp4", "webm", "mov", "mkv"], outputExtensions: ["mp3", "wav"] },
  { id: "ai-video-summarize", name: "AI Video Summarizer", description: "Auto-summarize video content with chapters and highlights.", category: "ai-video", iconName: "Sparkles", href: "/ai/video-summarize", status: "coming_soon", isLocal: false, tags: ["ai", "video", "summarize"], inputExtensions: ["mp4", "webm"], outputExtensions: ["txt", "md"] },
  { id: "subtitle-generator", name: "AI Subtitle Generator", description: "Auto-generate subtitles and captions for any video.", category: "ai-video", iconName: "Subtitles", href: "/ai/subtitles", status: "coming_soon", isLocal: false, tags: ["subtitles", "captions", "ai", "video"], inputExtensions: ["mp4", "webm"], outputExtensions: ["txt"] },

  // ─────────────────────────────────────────────────────────────────────────
  // GIF TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "gif-maker", name: "GIF Maker", description: "Create animated GIFs from images or video clips.", category: "gif", iconName: "Clapperboard", href: "/gif/maker", status: "coming_soon", isLocal: false, tags: ["gif", "animate", "create"], inputExtensions: ["png", "jpg", "jpeg", "mp4"], outputExtensions: ["gif"] },
  { id: "gif-compress", name: "GIF Compressor", description: "Reduce GIF file sizes without losing animation.", category: "gif", iconName: "Minimize2", href: "/gif/compress", status: "coming_soon", isLocal: false, tags: ["gif", "compress"], inputExtensions: ["gif"], outputExtensions: ["gif"] },

  // ─────────────────────────────────────────────────────────────────────────
  // MEDIA DOWNLOADER
  // ─────────────────────────────────────────────────────────────────────────
  { id: "youtube-downloader", name: "YouTube Video Downloader", description: "Download YouTube videos for offline use (authorized content only).", category: "media-download", iconName: "Download", href: "/media/youtube", status: "coming_soon", isLocal: false, tags: ["youtube", "download", "video"], inputExtensions: [], outputExtensions: ["mp4"] },
  { id: "youtube-audio", name: "YouTube Audio Downloader", description: "Extract audio from YouTube videos (authorized content only).", category: "media-download", iconName: "Music", href: "/media/youtube-audio", status: "coming_soon", isLocal: false, tags: ["youtube", "audio", "mp3", "download"], inputExtensions: [], outputExtensions: ["mp3"] },
  { id: "youtube-transcript", name: "YouTube Transcript Extractor", description: "Extract and download subtitles/transcripts from YouTube.", category: "media-download", iconName: "FileText", href: "/media/youtube-transcript", status: "coming_soon", isLocal: false, tags: ["youtube", "transcript", "subtitles"], inputExtensions: [], outputExtensions: ["txt"] },
  { id: "social-downloader", name: "Social Media Downloader", description: "Download media from social platforms (authorized content only).", category: "media-download", iconName: "Download", href: "/media/social", status: "coming_soon", isLocal: false, tags: ["social", "download", "instagram", "tiktok"], inputExtensions: [], outputExtensions: ["mp4", "jpg"] },

  // ─────────────────────────────────────────────────────────────────────────
  // ARCHIVE / FILE TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "zip-creator", name: "ZIP Creator", description: "Create ZIP archives from multiple files in your browser.", category: "archive", iconName: "Archive", href: "/archive/zip", isPopular: true, status: "ready", isLocal: true, tags: ["zip", "archive", "compress", "files"], inputExtensions: ["*"], outputExtensions: ["zip"] },
  { id: "zip-extractor", name: "ZIP Extractor", description: "Extract files from ZIP archives in the browser.", category: "archive", iconName: "FolderOpen", href: "/archive/zip", status: "ready", isLocal: true, tags: ["zip", "extract", "unzip"], inputExtensions: ["zip"], outputExtensions: ["*"] },
  { id: "file-hash-gen", name: "File Hash Generator", description: "Compute MD5, SHA-1, SHA-256, SHA-512 for any file.", category: "archive", iconName: "Hash", href: "/security/hash-file", status: "ready", isLocal: true, tags: ["hash", "md5", "sha256", "checksum"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "file-type-detect", name: "File Type Detector", description: "Detect real file type from magic bytes, not just extension.", category: "archive", iconName: "Search", href: "/security/file-inspect", status: "ready", isLocal: true, tags: ["file type", "mime", "detect"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "mime-detector", name: "MIME Type Detector", description: "Determine MIME type from file contents.", category: "archive", iconName: "Code2", href: "/security/file-inspect", status: "ready", isLocal: true, tags: ["mime", "type", "detect"], inputExtensions: ["*"], outputExtensions: [] },

  // ─────────────────────────────────────────────────────────────────────────
  // DEVELOPER TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "json-formatter", name: "JSON Formatter", description: "Beautify, format, validate, and minify JSON data.", category: "developer", iconName: "Braces", href: "/developer/json", isPopular: true, status: "ready", isLocal: true, tags: ["json", "format", "validate", "beautify", "developer"], inputExtensions: ["json"], outputExtensions: ["json"] },
  { id: "json-to-csv", name: "JSON to CSV", description: "Convert JSON arrays to CSV spreadsheet format.", category: "developer", iconName: "Table", href: "/developer/json-csv", status: "ready", isLocal: true, tags: ["json", "csv", "convert", "developer"], inputExtensions: ["json"], outputExtensions: ["csv"] },
  { id: "csv-to-json", name: "CSV to JSON", description: "Convert CSV data to structured JSON arrays.", category: "developer", iconName: "Braces", href: "/developer/json-csv", status: "ready", isLocal: true, tags: ["csv", "json", "convert", "developer"], inputExtensions: ["csv"], outputExtensions: ["json"] },
  { id: "yaml-formatter", name: "YAML Formatter", description: "Validate, format, and convert YAML data.", category: "developer", iconName: "FileCode", href: "/developer/yaml", status: "ready", isLocal: true, tags: ["yaml", "format", "validate", "developer"], inputExtensions: ["yaml", "yml"], outputExtensions: ["yaml", "yml"] },
  { id: "json-yaml", name: "JSON ↔ YAML Converter", description: "Convert between JSON and YAML formats.", category: "developer", iconName: "RefreshCw", href: "/developer/yaml", status: "ready", isLocal: true, tags: ["json", "yaml", "convert", "developer"], inputExtensions: ["json", "yaml", "yml"], outputExtensions: ["json", "yaml", "yml"] },
  { id: "xml-formatter", name: "XML Formatter", description: "Beautify and validate XML documents.", category: "developer", iconName: "Code2", href: "/developer/xml", status: "ready", isLocal: true, tags: ["xml", "format", "validate", "developer"], inputExtensions: ["xml"], outputExtensions: ["xml"] },
  { id: "base64", name: "Base64 Encoder / Decoder", description: "Encode and decode Base64 strings and files.", category: "developer", iconName: "Binary", href: "/developer/base64", isPopular: true, status: "ready", isLocal: true, tags: ["base64", "encode", "decode", "developer"], inputExtensions: ["*"], outputExtensions: ["txt"] },
  { id: "url-encode", name: "URL Encoder / Decoder", description: "Encode and decode URL percent-encoded strings.", category: "developer", iconName: "Link", href: "/developer/url-encode", status: "ready", isLocal: true, tags: ["url", "encode", "decode", "percent", "developer"], inputExtensions: [], outputExtensions: [] },
  { id: "uuid-gen", name: "UUID Generator", description: "Generate V4 UUIDs for databases and development.", category: "developer", iconName: "Key", href: "/developer/uuid", isPopular: true, status: "ready", isLocal: true, tags: ["uuid", "guid", "generate", "developer"], inputExtensions: [], outputExtensions: [] },
  { id: "password-gen", name: "Password Generator", description: "Generate cryptographically secure random passwords.", category: "developer", iconName: "Lock", href: "/developer/password", isPopular: true, status: "ready", isLocal: true, tags: ["password", "generate", "secure", "random"], inputExtensions: [], outputExtensions: [] },
  { id: "hash-gen", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 from text.", category: "developer", iconName: "Hash", href: "/developer/hash", isPopular: true, status: "ready", isLocal: true, tags: ["hash", "md5", "sha256", "sha512", "developer"], inputExtensions: ["txt"], outputExtensions: [] },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JWT token payloads.", category: "developer", iconName: "Shield", href: "/developer/jwt", status: "ready", isLocal: true, tags: ["jwt", "token", "decode", "developer"], inputExtensions: [], outputExtensions: ["json"] },
  { id: "regex-tester", name: "Regex Tester", description: "Test regular expressions with live match highlighting.", category: "developer", iconName: "Terminal", href: "/developer/regex", isPopular: true, status: "ready", isLocal: true, tags: ["regex", "regexp", "pattern", "test", "developer"], inputExtensions: [], outputExtensions: [] },
  { id: "timestamp-convert", name: "Timestamp Converter", description: "Convert Unix timestamps to human-readable dates.", category: "developer", iconName: "Clock", href: "/developer/timestamp", status: "ready", isLocal: true, tags: ["timestamp", "unix", "date", "convert", "developer"], inputExtensions: [], outputExtensions: [] },
  { id: "cron-parser", name: "Cron Expression Parser", description: "Parse and explain cron schedule expressions.", category: "developer", iconName: "Calendar", href: "/developer/cron", status: "ready", isLocal: true, tags: ["cron", "schedule", "parse", "developer"], inputExtensions: [], outputExtensions: [] },
  { id: "html-formatter", name: "HTML Formatter / Minifier", description: "Beautify or minify HTML markup.", category: "developer", iconName: "Code2", href: "/developer/html", status: "ready", isLocal: true, tags: ["html", "format", "minify", "developer"], inputExtensions: ["html"], outputExtensions: ["html"] },
  { id: "css-formatter", name: "CSS Formatter / Minifier", description: "Beautify or minify CSS stylesheets.", category: "developer", iconName: "Paintbrush", href: "/developer/css", status: "ready", isLocal: true, tags: ["css", "format", "minify", "developer"], inputExtensions: ["css"], outputExtensions: ["css"] },
  { id: "js-formatter", name: "JavaScript Formatter", description: "Prettify or minify JavaScript code.", category: "developer", iconName: "Terminal", href: "/developer/javascript", status: "ready", isLocal: true, tags: ["javascript", "js", "format", "minify", "developer"], inputExtensions: ["js"], outputExtensions: ["js"] },
  { id: "markdown-editor", name: "Markdown Editor", description: "Write Markdown with live preview and export.", category: "developer", iconName: "FileCode", href: "/developer/markdown", isPopular: true, status: "ready", isLocal: true, tags: ["markdown", "editor", "preview", "md"], inputExtensions: ["md", "txt"], outputExtensions: ["md", "html"] },
  { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text in various formats.", category: "developer", iconName: "AlignLeft", href: "/developer/lorem", status: "ready", isLocal: true, tags: ["lorem ipsum", "placeholder", "text", "developer"], inputExtensions: [], outputExtensions: ["txt"] },
  { id: "csv-viewer", name: "CSV Viewer & Editor", description: "View and edit CSV files in a data grid.", category: "developer", iconName: "Table", href: "/developer/csv", status: "ready", isLocal: true, tags: ["csv", "view", "edit", "spreadsheet"], inputExtensions: ["csv"], outputExtensions: ["csv"] },
  { id: "sql-formatter", name: "SQL Formatter", description: "Beautify and format SQL queries.", category: "developer", iconName: "Database", href: "/developer/sql", status: "ready", isLocal: true, tags: ["sql", "format", "beautify", "developer"], inputExtensions: ["sql"], outputExtensions: ["sql"] },
  { id: "user-agent", name: "User Agent Parser", description: "Parse and inspect browser User-Agent strings.", category: "developer", iconName: "Monitor", href: "/developer/useragent", status: "ready", isLocal: true, tags: ["user agent", "browser", "parse", "developer"], inputExtensions: [], outputExtensions: [] },

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and reading time.", category: "text", iconName: "AlignLeft", href: "/text/word-counter", isPopular: true, status: "ready", isLocal: true, tags: ["word count", "character count", "reading time", "text"], inputExtensions: ["txt", "md"], outputExtensions: [] },
  { id: "text-case", name: "Text Case Converter", description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase.", category: "text", iconName: "Type", href: "/text/case", status: "ready", isLocal: true, tags: ["uppercase", "lowercase", "title case", "text"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "text-diff", name: "Text Compare / Diff", description: "Find and highlight differences between two text blocks.", category: "text", iconName: "GitCompare", href: "/text/diff", status: "ready", isLocal: true, tags: ["diff", "compare", "text", "difference"], inputExtensions: ["txt"], outputExtensions: [] },
  { id: "find-replace", name: "Find & Replace", description: "Find and replace text with regex support.", category: "text", iconName: "Search", href: "/text/find-replace", status: "ready", isLocal: true, tags: ["find replace", "text", "search"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "remove-duplicates", name: "Remove Duplicate Lines", description: "Deduplicate and clean text line lists.", category: "text", iconName: "Trash2", href: "/text/clean", status: "ready", isLocal: true, tags: ["duplicates", "dedup", "text", "lines"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "sort-lines", name: "Sort Lines", description: "Sort text lines alphabetically or numerically.", category: "text", iconName: "ArrowUpDown", href: "/text/clean", status: "ready", isLocal: true, tags: ["sort", "lines", "text"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "reverse-text", name: "Reverse Text", description: "Reverse characters or lines in text.", category: "text", iconName: "ArrowLeftRight", href: "/text/clean", status: "ready", isLocal: true, tags: ["reverse", "flip", "text"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "whitespace-remover", name: "Whitespace Remover", description: "Strip extra whitespace, blank lines, and trailing spaces.", category: "text", iconName: "Eraser", href: "/text/clean", status: "ready", isLocal: true, tags: ["whitespace", "trim", "clean", "text"], inputExtensions: ["txt"], outputExtensions: ["txt"] },
  { id: "text-summarizer", name: "Text Summarizer", description: "AI-powered extractive text summarization.", category: "text", iconName: "Sparkles", href: "/ai/text-summarize", status: "coming_soon", isLocal: false, tags: ["summarize", "ai", "text"], inputExtensions: ["txt", "md"], outputExtensions: ["txt"] },
  { id: "markdown-preview", name: "Markdown Preview", description: "Render Markdown to styled HTML in realtime.", category: "text", iconName: "Eye", href: "/developer/markdown", status: "ready", isLocal: true, tags: ["markdown", "preview", "render"], inputExtensions: ["md"], outputExtensions: ["html"] },

  // ─────────────────────────────────────────────────────────────────────────
  // CALCULATORS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "percentage-calc", name: "Percentage Calculator", description: "Calculate percentages, changes, and ratios.", category: "calculator", iconName: "Percent", href: "/calculator/percentage", status: "ready", isLocal: true, tags: ["percentage", "calculator", "math"], inputExtensions: [], outputExtensions: [] },
  { id: "gst-calc", name: "GST Calculator", description: "Calculate GST inclusive and exclusive amounts.", category: "calculator", iconName: "Receipt", href: "/calculator/gst", status: "ready", isLocal: true, tags: ["gst", "tax", "calculator"], inputExtensions: [], outputExtensions: [] },
  { id: "emi-calc", name: "EMI Calculator", description: "Calculate loan EMI, interest, and repayment schedule.", category: "calculator", iconName: "CreditCard", href: "/calculator/emi", status: "ready", isLocal: true, tags: ["emi", "loan", "interest", "calculator"], inputExtensions: [], outputExtensions: [] },
  { id: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature, area, volume, speed.", category: "calculator", iconName: "Ruler", href: "/calculator/unit", isPopular: true, status: "ready", isLocal: true, tags: ["unit", "convert", "length", "weight", "temperature"], inputExtensions: [], outputExtensions: [] },
  { id: "date-calc", name: "Date Calculator", description: "Calculate date differences, add/subtract days.", category: "calculator", iconName: "Calendar", href: "/calculator/date", status: "ready", isLocal: true, tags: ["date", "calculator", "days"], inputExtensions: [], outputExtensions: [] },
  { id: "base-converter", name: "Number Base Converter", description: "Convert between binary, decimal, hex, and octal.", category: "calculator", iconName: "Binary", href: "/calculator/base", status: "ready", isLocal: true, tags: ["binary", "hex", "decimal", "octal", "convert"], inputExtensions: [], outputExtensions: [] },
  { id: "age-calculator", name: "Age Calculator", description: "Calculate exact age from date of birth.", category: "calculator", iconName: "User", href: "/calculator/age", status: "ready", isLocal: true, tags: ["age", "calculator", "dob"], inputExtensions: [], outputExtensions: [] },

  // ─────────────────────────────────────────────────────────────────────────
  // QR TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "qr-generator", name: "QR Code Generator", description: "Generate QR codes for URLs, text, WiFi, contacts, emails.", category: "qr", iconName: "QrCode", href: "/qr/generator", isPopular: true, status: "ready", isLocal: true, tags: ["qr", "generate", "url", "wifi", "contact"], inputExtensions: [], outputExtensions: ["png", "svg"] },
  { id: "qr-scanner", name: "QR Code Scanner", description: "Scan QR codes from camera or uploaded image.", category: "qr", iconName: "Scan", href: "/qr/scanner", status: "ready", isLocal: true, tags: ["qr", "scan", "camera", "decode"], inputExtensions: ["png", "jpg", "jpeg", "webp"], outputExtensions: [] },
  { id: "qr-wifi", name: "WiFi QR Generator", description: "Generate QR codes for WiFi network sharing.", category: "qr", iconName: "Wifi", href: "/qr/generator", status: "ready", isLocal: true, tags: ["qr", "wifi", "network"], inputExtensions: [], outputExtensions: ["png", "svg"] },
  { id: "qr-contact", name: "Contact QR (vCard)", description: "Generate vCard QR codes for contact sharing.", category: "qr", iconName: "User", href: "/qr/generator", status: "ready", isLocal: true, tags: ["qr", "vcard", "contact"], inputExtensions: [], outputExtensions: ["png", "svg"] },
  { id: "qr-batch", name: "Batch QR Generator", description: "Generate multiple QR codes from a CSV list.", category: "qr", iconName: "Layers", href: "/qr/batch", status: "coming_soon", isLocal: true, tags: ["qr", "batch", "bulk", "generate"], inputExtensions: ["csv"], outputExtensions: ["zip"] },

  // ─────────────────────────────────────────────────────────────────────────
  // BARCODE TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "barcode-gen", name: "Barcode Generator", description: "Generate Code128, Code39, EAN-13, EAN-8, UPC, ISBN barcodes.", category: "barcode", iconName: "BarChart2", href: "/barcode/generator", isPopular: true, status: "ready", isLocal: true, tags: ["barcode", "generate", "ean", "code128", "isbn"], inputExtensions: [], outputExtensions: ["png", "svg"] },
  { id: "barcode-scanner", name: "Barcode Scanner", description: "Scan barcodes using camera or image upload.", category: "barcode", iconName: "Scan", href: "/barcode/scanner", status: "coming_soon", isLocal: true, tags: ["barcode", "scan", "detect"], inputExtensions: ["png", "jpg", "jpeg", "webp"], outputExtensions: [] },
  { id: "batch-barcode", name: "Batch Barcode Generator", description: "Generate bulk barcodes from CSV or list input.", category: "barcode", iconName: "Layers", href: "/barcode/batch", status: "coming_soon", isLocal: true, tags: ["barcode", "batch", "bulk"], inputExtensions: ["csv"], outputExtensions: ["zip"] },

  // ─────────────────────────────────────────────────────────────────────────
  // CLIPBOARD & TRANSFER
  // ─────────────────────────────────────────────────────────────────────────
  { id: "online-clipboard", name: "Online Clipboard", description: "Sync text, URLs, and code between devices with room codes.", category: "clipboard", iconName: "ClipboardCopy", href: "/clipboard", isPopular: true, status: "ready", isLocal: true, tags: ["clipboard", "sync", "cross device", "realtime"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "quicksend", name: "QuickSend Transfer", description: "P2P browser-to-browser file transfer via WebRTC.", category: "transfer", iconName: "Send", href: "/transfer", isPopular: true, status: "ready", isLocal: true, tags: ["transfer", "p2p", "webrtc", "quicksend", "send"], inputExtensions: ["*"], outputExtensions: ["*"] },
  { id: "qr-device-pair", name: "QR Device Pairing", description: "Pair desktop and phone instantly via QR scan.", category: "device", iconName: "Link2", href: "/device/pair", status: "coming_soon", isLocal: true, tags: ["device", "pair", "qr", "sync"], inputExtensions: [], outputExtensions: [] },
  { id: "scan-to-desktop", name: "Scan to Desktop", description: "Scan paper documents on your phone and receive them on PC.", category: "device", iconName: "Smartphone", href: "/device/scan-to-desktop", status: "coming_soon", isLocal: true, tags: ["scan", "phone to pc", "mobile", "scanner"], inputExtensions: [], outputExtensions: ["pdf", "jpg"] },

  // ─────────────────────────────────────────────────────────────────────────
  // WEB TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "url-shortener", name: "URL Shortener", description: "Create short, shareable links from long URLs.", category: "web", iconName: "Link", href: "/web/url-shortener", status: "coming_soon", isLocal: false, tags: ["url", "shorten", "link"], inputExtensions: [], outputExtensions: [] },
  { id: "og-preview", name: "Open Graph Preview", description: "Preview how links appear on social media platforms.", category: "web", iconName: "Eye", href: "/web/og-preview", status: "ready", isLocal: true, tags: ["open graph", "og", "social", "preview"], inputExtensions: [], outputExtensions: [] },
  { id: "favicon-gen", name: "Favicon Generator", description: "Generate favicons in all required sizes from an image.", category: "web", iconName: "Globe", href: "/web/favicon", status: "ready", isLocal: true, tags: ["favicon", "icon", "web"], inputExtensions: ["png", "jpg", "svg"], outputExtensions: ["png", "zip"] },
  { id: "robots-gen", name: "Robots.txt Generator", description: "Generate robots.txt files for SEO configuration.", category: "web", iconName: "Bot", href: "/web/robots", status: "ready", isLocal: true, tags: ["robots.txt", "seo", "web"], inputExtensions: [], outputExtensions: ["txt"] },

  // ─────────────────────────────────────────────────────────────────────────
  // SECURITY & PRIVACY
  // ─────────────────────────────────────────────────────────────────────────
  { id: "secure-hash-file", name: "File Hash Checker", description: "Verify file integrity with MD5, SHA-1, SHA-256, SHA-512 and visual part inspector.", category: "security-privacy", iconName: "ShieldCheck", href: "/security/hash-file", isPopular: true, status: "ready", isLocal: true, tags: ["hash", "sha256", "md5", "integrity", "checksum"], inputExtensions: ["*"], outputExtensions: [] },
  { id: "password-generator", name: "Password Generator", description: "Create cryptographically secure random passwords.", category: "security-privacy", iconName: "Key", href: "/developer/password", isPopular: true, status: "ready", isLocal: true, tags: ["password", "secure", "random", "generate"], inputExtensions: [], outputExtensions: [] },
  { id: "metadata-remove-image", name: "Image EXIF Remover", description: "Strip EXIF and location metadata from photos.", category: "security-privacy", iconName: "EyeOff", href: "/security/exif-remove", status: "ready", isLocal: true, tags: ["exif", "metadata", "remove", "privacy", "image"], inputExtensions: ["jpg", "jpeg", "png", "webp"], outputExtensions: ["jpg", "jpeg", "png", "webp"] },

  // ─────────────────────────────────────────────────────────────────────────
  // BUSINESS TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "invoice-gen", name: "Invoice Generator", description: "Create professional PDF invoices instantly in A4 size.", category: "business", iconName: "Receipt", href: "/business/invoice", isPopular: true, status: "coming_soon", isLocal: true, tags: ["invoice", "pdf", "business", "generator"], inputExtensions: [], outputExtensions: ["pdf"] },
  { id: "receipt-gen", name: "Receipt Generator", description: "Generate printable receipts in PDF format.", category: "business", iconName: "Receipt", href: "/business/receipt", status: "coming_soon", isLocal: true, tags: ["receipt", "pdf", "business"], inputExtensions: [], outputExtensions: ["pdf"] },
  { id: "certificate-gen", name: "Certificate Generator", description: "Create and export professional certificates as PDF.", category: "business", iconName: "Award", href: "/business/certificate", status: "coming_soon", isLocal: true, tags: ["certificate", "pdf", "business"], inputExtensions: [], outputExtensions: ["pdf"] },
  { id: "contract-gen", name: "Contract Generator", description: "Generate agreements and contracts from templates.", category: "business", iconName: "FileText", href: "/business/contract", status: "coming_soon", isLocal: true, tags: ["contract", "agreement", "business"], inputExtensions: [], outputExtensions: ["pdf", "docx"] },

  // ─────────────────────────────────────────────────────────────────────────
  // EDUCATION TOOLS
  // ─────────────────────────────────────────────────────────────────────────
  { id: "notes-gen", name: "Study Notes Generator", description: "AI-generated study notes and summaries from documents.", category: "education", iconName: "BookOpen", href: "/ai/notes", status: "coming_soon", isLocal: false, tags: ["notes", "study", "ai", "education"], inputExtensions: ["pdf", "docx", "txt"], outputExtensions: ["pdf", "docx", "md"] },
  { id: "flashcard-gen", name: "Flashcard Generator", description: "Auto-generate flashcards from any document.", category: "education", iconName: "Layers", href: "/ai/flashcards", status: "coming_soon", isLocal: false, tags: ["flashcards", "study", "ai", "education"], inputExtensions: ["pdf", "docx", "txt"], outputExtensions: ["json"] },
  { id: "quiz-gen", name: "Quiz Generator", description: "Generate MCQ and open-ended quiz from any text.", category: "education", iconName: "HelpCircle", href: "/ai/quiz", status: "coming_soon", isLocal: false, tags: ["quiz", "mcq", "study", "ai"], inputExtensions: ["pdf", "docx", "txt"], outputExtensions: ["json"] },
  { id: "citation-extract", name: "Citation Extractor", description: "Extract references and citations from research papers.", category: "education", iconName: "BookMarked", href: "/ai/citations", status: "coming_soon", isLocal: false, tags: ["citations", "references", "research", "ai"], inputExtensions: ["pdf"], outputExtensions: ["txt", "json"] },

  // ─────────────────────────────────────────────────────────────────────────
  // WORKFLOW
  // ─────────────────────────────────────────────────────────────────────────
  { id: "workflow-builder", name: "Workflow Builder", description: "Build and save multi-step document processing automation pipelines.", category: "workflow", iconName: "GitFork", href: "/workflows", isPopular: true, status: "coming_soon", isLocal: true, tags: ["workflow", "automation", "pipeline", "batch"], inputExtensions: ["*"], outputExtensions: ["*"] },

  // ─────────────────────────────────────────────────────────────────────────
  // MISC
  // ─────────────────────────────────────────────────────────────────────────
  { id: "screenshot-to-pdf", name: "Screenshot to PDF", description: "Convert screenshots to standard A4 PDF documents.", category: "misc", iconName: "Camera", href: "/image/to-pdf", status: "ready", isLocal: true, tags: ["screenshot", "pdf", "convert"], inputExtensions: ["png", "jpg", "jpeg"], outputExtensions: ["pdf"] },
  { id: "screen-recorder", name: "Screen Recorder", description: "Record your screen directly in the browser.", category: "misc", iconName: "Video", href: "/misc/screen-record", status: "coming_soon", isLocal: true, tags: ["screen record", "capture", "video"], inputExtensions: [], outputExtensions: ["webm", "mp4"] },
];
