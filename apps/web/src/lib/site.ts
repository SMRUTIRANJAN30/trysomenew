/**
 * Single source of truth for the public site URL.
 * Set NEXT_PUBLIC_APP_URL in the host's environment when moving to a custom domain;
 * every canonical URL, sitemap entry, OG tag and JSON-LD block follows it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://trysomenew.netlify.app").replace(/\/+$/, "");

export const SITE_NAME = "trysomenew";

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;
