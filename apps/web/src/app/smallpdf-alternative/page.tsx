import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Smallpdf Alternative: Free Local Document Workspace | trysomenew",
  description:
    "An honest review comparing Smallpdf with trysomenew. Learn how zero-storage client processing eliminates paywalls and protects your file privacy.",
  alternates: {
    canonical: "https://trysomenew.com/smallpdf-alternative",
  },
};

export default function SmallpdfAlternativePage() {
  const comparisonData = [
    { feature: "Free Daily Conversions", trysomenew: "Unlimited Always", smallpdf: "Strict 2 Tasks / Day Limit" },
    { feature: "Privacy & Cloud Storage", trysomenew: "100% In-Browser RAM Only", smallpdf: "Files Uploaded to Cloud Servers" },
    { feature: "Subscription Paywalls", trysomenew: "No Paywalls, 100% Free", smallpdf: "$9–$12/month Pro Paywall" },
    { feature: "Speed on Large Documents", trysomenew: "Instant Local WebAssembly", smallpdf: "Requires Full Upload & Download" },
    { feature: "Cross-Device Clipboard Beam", trysomenew: "Built-in Encrypted QR Sync", smallpdf: "Not Available" },
    { feature: "Account Requirement", trysomenew: "Zero Signup or Credit Cards", smallpdf: "Prompts for Account After 1 Tool" },
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Comparisons", href: "/tools" },
          { label: "Smallpdf Alternative" },
        ]}
      />

      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Honest Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Smallpdf Alternative: No Paywalls, No Uploads
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          Smallpdf popularized drag-and-drop web converters, but their strict 2-file daily limit and subscription
          paywalls frequently interrupt workflows. Here is why professionals choose trysomenew.
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
              <th className="p-4 font-semibold text-[var(--muted)]">Smallpdf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {comparisonData.map((row) => (
              <tr key={row.feature} className="hover:bg-[var(--sunken)]/40">
                <td className="p-4 font-medium text-[var(--ink)]">{row.feature}</td>
                <td className="p-4 font-semibold text-[var(--pine)] bg-[var(--pine-tint)]/20">
                  {row.trysomenew}
                </td>
                <td className="p-4 text-[var(--muted)]">{row.smallpdf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editorial Content */}
      <div className="space-y-8 text-sm sm:text-base text-[var(--muted)] leading-relaxed border-t border-[var(--line)] pt-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--ink)]">
            Transparent, Honest Tools Without Paywall Interruption
          </h2>
          <p>
            When you need to merge three PDFs for an urgent client deadline or compress a scanned resume,
            hitting a forced subscription screen after your second file wastes time.
          </p>
          <p>
            trysomenew is architected on local-first principles. By offloading document processing directly to your browser,
            we avoid expensive server compute bills, allowing us to keep all 177+ tools permanently free and unlimited.
          </p>
        </div>

        <div className="p-6 bg-[var(--sunken)] border border-[var(--line)] rounded-[8px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)] mb-1">
              Start processing unlimited documents
            </h3>
            <p className="text-xs text-[var(--muted)]">
              100% free with no daily limits or watermarks.
            </p>
          </div>
          <Link href="/pdf/compress" className="btn-terracotta text-sm h-10 px-5 shrink-0">
            <span>Open Compress PDF</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
