import type { MetadataRoute } from "next";
import { TOOLS_CONFIG } from "@/config/tools";
import { BLOG_POSTS } from "@/config/blog";
import { absoluteUrl } from "@/lib/site";

// Only canonical, indexable URLs. Alias URLs (/merge-pdf etc.) 301 to these, so they are not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/pdf-tools"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/image-tools"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/developer-tools"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/ilovepdf-alternative"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/smallpdf-alternative"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const seen = new Set<string>();
  for (const tool of TOOLS_CONFIG) {
    const path = tool.href.split("?")[0];
    if (seen.has(path)) continue;
    seen.add(path);
    entries.push({ url: absoluteUrl(path), lastModified: now, changeFrequency: "monthly", priority: tool.isPopular ? 0.9 : 0.7 });
  }

  for (const post of BLOG_POSTS) {
    entries.push({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: now, changeFrequency: "yearly", priority: 0.5 });
  }
  return entries;
}
