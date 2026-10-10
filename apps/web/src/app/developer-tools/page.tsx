import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Code2 } from "lucide-react";
import { TOOLS_CONFIG } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Developer Tools: JSON, Base64, Diff & Hash Verification | trysomenew",
  description:
    "Essential client-side developer utilities. Format JSON, decode JWT, calculate SHA-256 binary digests, and check diffs in browser RAM.",
  alternates: {
    canonical: "https://trysomenew.com/developer-tools",
  },
};

export default function DeveloperToolsHubPage() {
  const devTools = TOOLS_CONFIG.filter((t) => t.category === "developer" || t.category === "security");

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Tools", href: "/tools" },
          { label: "Developer Tools Hub" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--cat-developer)] text-[#333A36] text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>Category Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Developer Tools Hub: Fast, Client-Side Utilities
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          Debug, format, encode, and verify data without pasting sensitive credentials into remote servers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
        {devTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
