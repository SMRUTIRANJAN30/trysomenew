import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Do NOT disallow /_next/ — Googlebot needs the JS/CSS to render pages.
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/theme/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
