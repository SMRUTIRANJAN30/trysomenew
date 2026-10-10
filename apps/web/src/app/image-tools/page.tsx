import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, Image as ImageIcon } from "lucide-react";
import { TOOLS_CONFIG } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Free Online Image Tools: Convert, Compress & Resize | trysomenew",
  description:
    "Fast in-browser image optimization tools. Convert JPG, PNG, WEBP to PDF, compress image file size, and remove EXIF privacy data locally.",
  alternates: {
    canonical: "https://trysomenew.com/image-tools",
  },
};

export default function ImageToolsHubPage() {
  const imageTools = TOOLS_CONFIG.filter((t) => t.category === "image" || t.slug === "image-to-pdf" || t.slug === "pdf-to-jpg");

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Tools", href: "/tools" },
          { label: "Image Tools Hub" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--cat-image)] text-[#1F5F4A] text-xs font-semibold">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Category Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Image Tools Hub: Convert, Compress & Optimize
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          High-performance image converters and visual studios running locally via HTML5 Canvas and WebAssembly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
        {imageTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
