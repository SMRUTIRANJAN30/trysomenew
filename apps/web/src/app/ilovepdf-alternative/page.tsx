import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Check, X, ShieldCheck, ArrowRight, Zap, Lock } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "iLovePDF Alternative: 100% Client-Side Free PDF Tools | trysomenew",
  description:
    "An honest comparison between iLovePDF and trysomenew. Discover how in-browser WebAssembly processing protects your document privacy with zero server uploads.",
  alternates: {
    canonical: "https://trysomenew.com/ilovepdf-alternative",
  },
};

export default function ILovePdfAlternativePage() {
  const comparisonData = [
    { feature: "Processing Location", trysomenew: "100% In-Browser (Device RAM)", ilovepdf: "Uploaded to Remote Servers" },
    { feature: "Server File Retention", trysomenew: "0 Bytes Uploaded (Never Stored)", ilovepdf: "Stored up to 2 hours" },
    { feature: "File Size / Page Limits", trysomenew: "Unlimited (Based on Device Memory)", ilovepdf: "Strict Limits on Free Tier" },
    { feature: "Queue & Upload Waiting", trysomenew: "Instant Local WebAssembly", ilovepdf: "Subject to Bandwidth & Server Queues" },
    { feature: "Cross-Device Beam Sync", trysomenew: "Built-in E2E Encrypted Clipboard", ilovepdf: "Not Available" },
    { feature: "Watermarks & Forced Paywalls", trysomenew: "Zero Watermarks, 100% Free", ilovepdf: "Paywalls on Advanced Features" },
    { feature: "Account Required", trysomenew: "Never Required", ilovepdf: "Required for High-Volume Tasks" },
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Comparisons", href: "/tools" },
          { label: "iLovePDF Alternative" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Honest Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          iLovePDF Alternative: Why Privacy-First Matters
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          iLovePDF has served millions for years, but traditional server-based converters introduce
          network upload delays, privacy vulnerabilities, and strict tier limits. Here is how trysomenew differs.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] overflow-hidden mb-12 shadow-xs">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <thead className="bg-[var(--sunken)] border-b border-[var(--line)]">
            <tr>
              <th className="p-4 font-semibold text-[var(--ink)]">Feature</th>
              <th className="p-4 font-semibold text-[var(--pine)] bg-[var(--pine-tint)]/40">
                trysomenew
              </th>
              <th className="p-4 font-semibold text-[var(--muted)]">iLovePDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {comparisonData.map((row) => (
              <tr key={row.feature} className="hover:bg-[var(--sunken)]/40">
                <td className="p-4 font-medium text-[var(--ink)]">{row.feature}</td>
                <td className="p-4 font-semibold text-[var(--pine)] bg-[var(--pine-tint)]/20">
                  {row.trysomenew}
                </td>
                <td className="p-4 text-[var(--muted)]">{row.ilovepdf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editorial Content */}
      <div className="space-y-8 text-sm sm:text-base text-[var(--muted)] leading-relaxed border-t border-[var(--line)] pt-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
            How Client-Side WebAssembly Protects Your Documents
          </h2>
          <p>
            When handling legal contracts, tax forms, financial statements, or private identification documents,
            uploading unencrypted PDFs across third-party cloud infrastructure carries inherent compliance and security risks.
          </p>
          <p>
            trysomenew leverages modern WebAssembly compiled binaries and client-side JavaScript to execute document manipulation
            in your computer or phone RAM. Once processing finishes, your files remain strictly on your local disk.
          </p>
        </div>

        <div className="p-6 bg-[var(--sunken)] border border-[var(--line)] rounded-[8px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)] mb-1">
              Ready to try private in-browser document tools?
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Merge, compress, split, and redact PDFs with zero uploads.
            </p>
          </div>
          <Link href="/pdf/merge" className="btn-terracotta text-sm h-10 px-5 shrink-0">
            <span>Open Merge PDF</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
