import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { TOOLS_CONFIG } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Free Online PDF Tools: Merge, Compress, Split & Redact | trysomenew",
  description:
    "Private, in-browser PDF tools. Merge multiple PDFs, compress file size, extract pages, redact sensitive text, and convert images to PDF with zero server storage.",
  alternates: {
    canonical: "https://trysomenew.com/pdf-tools",
  },
};

export default function PdfToolsHubPage() {
  const pdfTools = TOOLS_CONFIG.filter((t) => t.category === "pdf");

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Tools", href: "/tools" },
          { label: "PDF Tools Hub" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--cat-pdf)] text-[#8A2810] text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          PDF Tools Hub: Merge, Split & Compress
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          Process your PDF documents 100% locally in your browser memory using WebAssembly.
          Fast, lossless, and completely private with zero file uploads.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
        {pdfTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <div className="space-y-6 text-sm text-[var(--muted)] border-t border-[var(--line)] pt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
          Why Choose In-Browser PDF Processing?
        </h2>
        <p className="leading-relaxed">
          Traditional web PDF converters upload your contracts and financial statements to remote servers,
          introducing network bandwidth bottlenecks and potential data privacy vulnerabilities.
          trysomenew compiles document operations directly into WebAssembly binaries that run inside your device memory.
        </p>
      </div>
    </div>
  );
}
