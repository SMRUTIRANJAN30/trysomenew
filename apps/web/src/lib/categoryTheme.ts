export interface CategoryTheme {
  name: string;
  color: string;        // icon / accent color
  bgTint: string;       // card background tint hex
  bgLight: string;      // Tailwind bg class
  textLight: string;    // Tailwind text class
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const TOOLBENCH_CATEGORIES: Record<string, CategoryTheme> = {
  pdf: {
    name: "PDF Tools",
    color: "#FF5A3C",
    bgTint: "#FFD9D2",
    bgLight: "bg-[#FFD9D2] dark:bg-[#FF5A3C]/18",
    textLight: "text-[#FF5A3C] dark:text-[#FF8A75]",
    badgeBg: "bg-[#FFD9D2] dark:bg-[#FF5A3C]/20",
    badgeText: "text-[#B33D2B] dark:text-[#FFAE9E]",
    borderColor: "hover:border-[#FF5A3C]",
  },
  image: {
    name: "Image Tools",
    color: "#2ED47A",
    bgTint: "#D8F5E3",
    bgLight: "bg-[#D8F5E3] dark:bg-[#2ED47A]/18",
    textLight: "text-[#1A9E55] dark:text-[#5EEBB0]",
    badgeBg: "bg-[#D8F5E3] dark:bg-[#2ED47A]/20",
    badgeText: "text-[#15703D] dark:text-[#7AEEC3]",
    borderColor: "hover:border-[#2ED47A]",
  },
  video: {
    name: "Video & Audio",
    color: "#B9A6FF",
    bgTint: "#E6DFFF",
    bgLight: "bg-[#E6DFFF] dark:bg-[#B9A6FF]/18",
    textLight: "text-[#7B5FD6] dark:text-[#C8BAFF]",
    badgeBg: "bg-[#E6DFFF] dark:bg-[#B9A6FF]/20",
    badgeText: "text-[#5A3FB8] dark:text-[#D4C9FF]",
    borderColor: "hover:border-[#B9A6FF]",
  },
  text: {
    name: "Text & Writing",
    color: "#2B4DFF",
    bgTint: "#D9E3FF",
    bgLight: "bg-[#D9E3FF] dark:bg-[#2B4DFF]/18",
    textLight: "text-[#2B4DFF] dark:text-[#6B8AFF]",
    badgeBg: "bg-[#D9E3FF] dark:bg-[#2B4DFF]/20",
    badgeText: "text-[#1A30B8] dark:text-[#96AEFF]",
    borderColor: "hover:border-[#2B4DFF]",
  },
  converters: {
    name: "Converters",
    color: "#FFC933",
    bgTint: "#FFE9C2",
    bgLight: "bg-[#FFE9C2] dark:bg-[#FFC933]/18",
    textLight: "text-[#B88A10] dark:text-[#FFD966]",
    badgeBg: "bg-[#FFE9C2] dark:bg-[#FFC933]/20",
    badgeText: "text-[#8A6810] dark:text-[#FFE18A]",
    borderColor: "hover:border-[#FFC933]",
  },
  developer: {
    name: "Developer Tools",
    color: "#5C564E",
    bgTint: "#E4E0D6",
    bgLight: "bg-[#E4E0D6] dark:bg-[#F3EFE4]/10",
    textLight: "text-[#3D3830] dark:text-[#B5AFA5]",
    badgeBg: "bg-[#E4E0D6] dark:bg-[#F3EFE4]/10",
    badgeText: "text-[#2A2520] dark:text-[#C8C2B8]",
    borderColor: "hover:border-[#5C564E]",
  },
  calculators: {
    name: "Calculators",
    color: "#14B8A6",
    bgTint: "#CFF3EE",
    bgLight: "bg-[#CFF3EE] dark:bg-[#2ED47A]/15",
    textLight: "text-[#0D9488] dark:text-[#5EEAD4]",
    badgeBg: "bg-[#CFF3EE] dark:bg-[#14B8A6]/18",
    badgeText: "text-[#0E7B6E] dark:text-[#6EF0DB]",
    borderColor: "hover:border-[#14B8A6]",
  },
  seo: {
    name: "SEO & Web",
    color: "#EC4899",
    bgTint: "#FFD6EC",
    bgLight: "bg-[#FFD6EC] dark:bg-[#EC4899]/18",
    textLight: "text-[#DB2777] dark:text-[#F472B6]",
    badgeBg: "bg-[#FFD6EC] dark:bg-[#EC4899]/20",
    badgeText: "text-[#9D174D] dark:text-[#F9A8D4]",
    borderColor: "hover:border-[#EC4899]",
  },
};

export function getCategoryTheme(category: string): CategoryTheme {
  const cat = category.toLowerCase();

  if (cat.includes("pdf")) return TOOLBENCH_CATEGORIES.pdf;
  if (cat.includes("image") || cat.includes("svg") || cat.includes("photo")) return TOOLBENCH_CATEGORIES.image;
  if (cat.includes("video") || cat.includes("audio") || cat.includes("media") || cat.includes("speech") || cat.includes("record")) return TOOLBENCH_CATEGORIES.video;
  if (cat.includes("calc") || cat.includes("age") || cat.includes("emi") || cat.includes("percentage") || cat.includes("unit")) return TOOLBENCH_CATEGORIES.calculators;
  if (cat.includes("seo") || cat.includes("web") || cat.includes("sitemap") || cat.includes("robots") || cat.includes("og") || cat.includes("favicon")) return TOOLBENCH_CATEGORIES.seo;
  if (cat.includes("text") || cat.includes("writing") || cat.includes("ocr") || cat.includes("ai") || cat.includes("chat") || cat.includes("notes")) return TOOLBENCH_CATEGORIES.text;
  if (cat.includes("convert") || cat.includes("business") || cat.includes("invoice") || cat.includes("receipt") || cat.includes("qr") || cat.includes("barcode")) return TOOLBENCH_CATEGORIES.converters;

  return TOOLBENCH_CATEGORIES.developer;
}
