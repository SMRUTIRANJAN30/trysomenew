// Lightweight category metadata — safe to import from global UI (header, menus, cards)
// without pulling the full tool catalog into every page bundle.

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
