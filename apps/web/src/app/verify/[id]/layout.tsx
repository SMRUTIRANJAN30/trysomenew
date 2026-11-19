import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/verify", "Document Verification Result", "Verify a document fingerprint.", { noindex: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
