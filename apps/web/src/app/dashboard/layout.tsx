import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/dashboard", "Your Dashboard", "Your favourite and recent tools.", { noindex: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
