import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/theme", "Theme Preview", "Design preview.", { noindex: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
