export interface CategoryTheme {
  name: string;
  color: string;
  bgLight: string;
  textLight: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export function getCategoryTheme(category: string): CategoryTheme {
  const cat = category.toLowerCase();

  if (cat.includes("pdf")) {
    return {
      name: "PDF Tools",
      color: "#EF4444",
      bgLight: "bg-red-500/10 dark:bg-red-500/15",
      textLight: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-50 dark:bg-red-950/40",
      badgeText: "text-red-700 dark:text-red-300",
      borderColor: "hover:border-red-400/50",
    };
  }

  if (cat.includes("image") || cat.includes("svg") || cat.includes("photo")) {
    return {
      name: "Image Tools",
      color: "#10B981",
      bgLight: "bg-emerald-500/10 dark:bg-emerald-500/15",
      textLight: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      borderColor: "hover:border-emerald-400/50",
    };
  }

  if (cat.includes("video") || cat.includes("media") || cat.includes("gif")) {
    return {
      name: "Video & Media",
      color: "#8B5CF6",
      bgLight: "bg-purple-500/10 dark:bg-purple-500/15",
      textLight: "text-purple-600 dark:text-purple-400",
      badgeBg: "bg-purple-50 dark:bg-purple-950/40",
      badgeText: "text-purple-700 dark:text-purple-300",
      borderColor: "hover:border-purple-400/50",
    };
  }

  if (cat.includes("text") || cat.includes("ocr") || cat.includes("ai") || cat.includes("audio")) {
    return {
      name: "Text & AI",
      color: "#3B82F6",
      bgLight: "bg-blue-500/10 dark:bg-blue-500/15",
      textLight: "text-blue-600 dark:text-blue-400",
      badgeBg: "bg-blue-50 dark:bg-blue-950/40",
      badgeText: "text-blue-700 dark:text-blue-300",
      borderColor: "hover:border-blue-400/50",
    };
  }

  if (cat.includes("convert") || cat.includes("calc") || cat.includes("business") || cat.includes("qr") || cat.includes("barcode")) {
    return {
      name: "Converters & Business",
      color: "#F97316",
      bgLight: "bg-orange-500/10 dark:bg-orange-500/15",
      textLight: "text-orange-600 dark:text-orange-400",
      badgeBg: "bg-orange-50 dark:bg-orange-950/40",
      badgeText: "text-orange-700 dark:text-orange-300",
      borderColor: "hover:border-orange-400/50",
    };
  }

  // Developer & Security fallback
  return {
    name: "Developer Tools",
    color: "#475569",
    bgLight: "bg-slate-500/10 dark:bg-slate-500/15",
    textLight: "text-slate-600 dark:text-slate-300",
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-300",
    borderColor: "hover:border-slate-400/50",
  };
}
