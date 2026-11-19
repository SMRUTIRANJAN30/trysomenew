import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about", "About trysomenew", "Why trysomenew exists: fast, free, privacy-first tools that run entirely in your browser. Built by Smrutiranjan Sahoo.");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
