export interface CategoryTheme {
  name: string;
  color: string;
  bgSoft: string;
  bgLight: string;
  textLight: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const AURORA_CATEGORIES: Record<string, CategoryTheme> = {
  pdf: {
    name: "PDF Tools",
    color: "#EF4444",
    bgSoft: "#FEE2E2",
    bgLight: "bg-[#FEE2E2] dark:bg-[#EF4444]/15",
    textLight: "text-[#EF4444] dark:text-[#F87171]",
    badgeBg: "bg-[#FEE2E2] dark:bg-red-950/40",
    badgeText: "text-[#991B1B] dark:text-[#FCA5A5]",
    borderColor: "hover:border-[#EF4444]/60",
  },
  image: {
    name: "Image Tools",
    color: "#10B981",
    bgSoft: "#D1FAE5",
    bgLight: "bg-[#D1FAE5] dark:bg-[#10B981]/15",
    textLight: "text-[#059669] dark:text-[#34D399]",
    badgeBg: "bg-[#D1FAE5] dark:bg-emerald-950/40",
    badgeText: "text-[#065F46] dark:text-[#6EE7B7]",
    borderColor: "hover:border-[#10B981]/60",
  },
  video: {
    name: "Video and Audio",
    color: "#8B5CF6",
    bgSoft: "#EDE9FE",
    bgLight: "bg-[#EDE9FE] dark:bg-[#8B5CF6]/15",
    textLight: "text-[#7C3AED] dark:text-[#A78BFA]",
    badgeBg: "bg-[#EDE9FE] dark:bg-purple-950/40",
    badgeText: "text-[#5B21B6] dark:text-[#C4B5FD]",
    borderColor: "hover:border-[#8B5CF6]/60",
  },
  text: {
    name: "Text and Writing",
    color: "#3B82F6",
    bgSoft: "#DBEAFE",
    bgLight: "bg-[#DBEAFE] dark:bg-[#3B82F6]/15",
    textLight: "text-[#2563EB] dark:text-[#60A5FA]",
    badgeBg: "bg-[#DBEAFE] dark:bg-blue-950/40",
    badgeText: "text-[#1E40AF] dark:text-[#93C5FD]",
    borderColor: "hover:border-[#3B82F6]/60",
  },
  converters: {
    name: "Converters",
    color: "#F97316",
    bgSoft: "#FFEDD5",
    bgLight: "bg-[#FFEDD5] dark:bg-[#F97316]/15",
    textLight: "text-[#EA580C] dark:text-[#FB923C]",
    badgeBg: "bg-[#FFEDD5] dark:bg-orange-950/40",
    badgeText: "text-[#9A3412] dark:text-[#FDBA74]",
    borderColor: "hover:border-[#F97316]/60",
  },
  developer: {
    name: "Developer Tools",
    color: "#475569",
    bgSoft: "#E2E8F0",
    bgLight: "bg-[#E2E8F0] dark:bg-[#475569]/25",
    textLight: "text-[#334155] dark:text-[#94A3B8]",
    badgeBg: "bg-[#E2E8F0] dark:bg-slate-800",
    badgeText: "text-[#1E293B] dark:text-[#CBD5E1]",
    borderColor: "hover:border-[#475569]/60",
  },
  calculators: {
    name: "Calculators",
    color: "#14B8A6",
    bgSoft: "#CCFBF1",
    bgLight: "bg-[#CCFBF1] dark:bg-[#14B8A6]/15",
    textLight: "text-[#0D9488] dark:text-[#2DD4BF]",
    badgeBg: "bg-[#CCFBF1] dark:bg-teal-950/40",
    badgeText: "text-[#115E59] dark:text-[#5EEAD4]",
    borderColor: "hover:border-[#14B8A6]/60",
  },
  seo: {
    name: "SEO and Web",
    color: "#EC4899",
    bgSoft: "#FCE7F3",
    bgLight: "bg-[#FCE7F3] dark:bg-[#EC4899]/15",
    textLight: "text-[#DB2777] dark:text-[#F472B6]",
    badgeBg: "bg-[#FCE7F3] dark:bg-pink-950/40",
    badgeText: "text-[#9D174D] dark:text-[#F9A8D4]",
    borderColor: "hover:border-[#EC4899]/60",
  },
};

export function getCategoryTheme(category: string): CategoryTheme {
  const cat = category.toLowerCase();

  if (cat.includes("pdf")) return AURORA_CATEGORIES.pdf;
  if (cat.includes("image") || cat.includes("svg") || cat.includes("photo")) return AURORA_CATEGORIES.image;
  if (cat.includes("video") || cat.includes("audio") || cat.includes("media") || cat.includes("speech") || cat.includes("record")) return AURORA_CATEGORIES.video;
  if (cat.includes("calc") || cat.includes("age") || cat.includes("emi") || cat.includes("percentage") || cat.includes("unit")) return AURORA_CATEGORIES.calculators;
  if (cat.includes("seo") || cat.includes("web") || cat.includes("sitemap") || cat.includes("robots") || cat.includes("og")) return AURORA_CATEGORIES.seo;
  if (cat.includes("text") || cat.includes("writing") || cat.includes("ocr") || cat.includes("ai") || cat.includes("chat") || cat.includes("notes")) return AURORA_CATEGORIES.text;
  if (cat.includes("convert") || cat.includes("business") || cat.includes("invoice") || cat.includes("receipt") || cat.includes("qr") || cat.includes("barcode")) return AURORA_CATEGORIES.converters;

  return AURORA_CATEGORIES.developer;
}
