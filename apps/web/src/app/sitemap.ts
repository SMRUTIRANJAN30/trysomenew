import { MetadataRoute } from "next";
import { TOOLS_CONFIG } from "@/config/tools";
import { TOOLS } from "@/lib/toolsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://trysomenew.com";
  const now = new Date();

  // Core static & comparison pages
  const coreRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/tools", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/beam", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/dashboard", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/ilovepdf-alternative", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/smallpdf-alternative", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/verify", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/merge-pdf", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/compress-pdf", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/image-to-pdf", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/pdf-to-jpg", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ocr-image", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/invoice-generator", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/screen-recorder", priority: 0.85, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Map all functional tools from tools data & config
  const toolHrefs = new Set<string>();
  const toolEntries: MetadataRoute.Sitemap = [];

  for (const tool of TOOLS) {
    if (tool.status === "ready" && tool.href.startsWith("/") && !toolHrefs.has(tool.href)) {
      toolHrefs.add(tool.href);
      if (!coreRoutes.some((c) => c.path === tool.href)) {
        toolEntries.push({
          url: `${baseUrl}${tool.href}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: tool.isPopular ? 0.85 : 0.75,
        });
      }
    }
  }

  return [...staticEntries, ...toolEntries];
}
