import { pageMetadata } from "@/lib/seo";
import HomeClient from "@/components/home/HomeClient";

export const metadata = {
  ...pageMetadata(
    "/",
    "trysomenew — Free Online PDF, Image & Developer Tools (No Upload)",
    "Free, fast, privacy-first online tools: merge, split and compress PDFs, convert and resize images, OCR, QR codes, calculators, JSON and developer utilities. Everything runs in your browser — no upload, no sign-up.",
  ),
  title: { absolute: "trysomenew — Free Online PDF, Image & Developer Tools (No Upload)" },
};

export default function HomePage() {
  return <HomeClient />;
}
