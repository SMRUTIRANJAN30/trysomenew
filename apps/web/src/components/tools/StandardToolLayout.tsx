"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ToolConfig, TOOLS_CONFIG, CATEGORY_NAMES, CATEGORY_TINTS, ToolCategory } from "@/config/tools";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Dropzone } from "@/components/ui/Dropzone";
import { Progress } from "@/components/ui/Progress";
import { ToolCard } from "@/components/common/ToolCard";
import { formatBytes } from "@/lib/utils";

export interface StandardToolLayoutProps {
  tool: ToolConfig;
  howToSteps?: { step: string; title: string; desc: string }[];
  features?: { title: string; desc: string }[];
  optionsPanel?: React.ReactNode;
  isProcessing?: boolean;
  progressPercent?: number;
  resultUrl?: string | null;
  resultFileName?: string;
  resultSize?: number;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onProcess: () => void;
  onReset: () => void;
  children?: React.ReactNode;
  processButtonText?: string;
}

export function StandardToolLayout({
  tool,
  howToSteps,
  features,
  optionsPanel,
  isProcessing = false,
  progressPercent = 0,
  resultUrl,
  resultFileName = "output.pdf",
  resultSize,
  files,
  onFilesSelected,
  onRemoveFile,
  onProcess,
  onReset,
  children,
  processButtonText = "Process File",
}: StandardToolLayoutProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const defaultHowTo = [
    {
      step: "01",
      title: "Select your files",
      desc: `Drop your ${tool.inputExtensions?.join(", ") || "document"} files into the box above or choose from your device.`,
    },
    {
      step: "02",
      title: "Configure options",
      desc: "Customize orientation, quality settings, page ranges, or ordering in real time.",
    },
    {
      step: "03",
      title: "Process & download",
      desc: "Click the action button to process in browser RAM and download your finished file instantly.",
    },
  ];

  const defaultFeatures = [
    {
      title: "100% In-Browser Privacy",
      desc: "Files are processed strictly in your local device memory using WebAssembly. Nothing is sent to our servers.",
    },
    {
      title: "Lossless Native Quality",
      desc: "Retains razor-sharp vector text, fonts, and clean metadata without artificial compression artifacts.",
    },
    {
      title: "Unlimited Free Use",
      desc: "No page limits, no daily caps, no hidden fees, and zero watermarks on exported files.",
    },
  ];

  const stepsToRender = howToSteps || defaultHowTo;
  const featuresToRender = features || defaultFeatures;

  // Find 6 related tools
  const relatedTools = TOOLS_CONFIG.filter(
    (t) => tool.related?.includes(t.slug) || (t.category === tool.category && t.slug !== tool.slug)
  ).slice(0, 6);

  const catName = CATEGORY_NAMES[tool.category as ToolCategory] || tool.category;
  const tint = CATEGORY_TINTS[tool.category as ToolCategory] || { bg: "#EFEBE3", text: "#1E2421", iconBg: "#EFEBE3" };

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      {/* 1. BREADCRUMB */}
      <Breadcrumb
        items={[
          { label: "Tools", href: "/tools" },
          { label: catName, href: `/tools?category=${tool.category}` },
          { label: tool.name },
        ]}
      />

      {/* 2. H1 + ONE-LINE INTRO */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: tint.text }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {catName}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold text-[var(--ink)]">
          {tool.name}
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      {/* 3. WORKSPACE INTERFACE CONTAINER */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 sm:p-8 mb-12 shadow-xs space-y-6">
        {/* State A: Result Ready */}
        {resultUrl ? (
          <div className="py-8 px-4 text-center space-y-6 animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-full bg-[var(--success-tint)] text-[var(--success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-[var(--ink)]">Your file is ready</h3>
              <p className="text-sm text-[var(--muted)]">
                {resultFileName} {resultSize ? `(${formatBytes(resultSize)})` : ""}
              </p>
            </div>

            {/* THE ONE TERRACOTTA ACTION BUTTON ON THIS SCREEN */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={resultUrl}
                download={resultFileName}
                className="btn-terracotta text-base h-12 px-8 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download File</span>
              </a>

              <button
                type="button"
                onClick={onReset}
                className="btn-secondary text-sm h-12 px-6 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Process Another File</span>
              </button>
            </div>
          </div>
        ) : files.length === 0 ? (
          /* State B: Dropzone Active */
          <Dropzone
            onFilesSelected={onFilesSelected}
            accept={tool.inputExtensions?.map((e) => `.${e}`).join(",")}
            maxSizeMB={tool.maxFileSizeMB || 100}
            label={`Choose ${tool.name} files or drag & drop here`}
            description={`Supports ${tool.inputExtensions?.join(", ") || "all standard files"} up to ${tool.maxFileSizeMB || 100} MB.`}
          />
        ) : (
          /* State C: Files Selected & Options Panel */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: File List with Thumbnails and Remove Buttons */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                  <span className="text-xs font-semibold text-[var(--muted)] uppercase">
                    Selected Files ({files.length})
                  </span>
                  <button
                    onClick={onReset}
                    className="text-xs font-semibold text-[var(--error)] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {files.map((file, idx) => (
                    <div
                      key={file.name + idx}
                      className="flex items-center justify-between p-3 bg-[var(--sunken)] border border-[var(--line)] rounded-[6px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-[4px] bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[var(--pine)]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--ink)] truncate">
                            {file.name}
                          </p>
                          <span className="text-[10px] font-mono text-[var(--muted)]">
                            {formatBytes(file.size)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFile(idx)}
                        aria-label={`Remove ${file.name}`}
                        className="p-1.5 text-[var(--muted)] hover:text-[var(--error)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional custom tool children if needed */}
                {children}
              </div>

              {/* Right Column: Options Panel */}
              <div className="lg:col-span-5 bg-[var(--sunken)] border border-[var(--line)] rounded-[6px] p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] pb-2 border-b border-[var(--line)]">
                  Processing Options
                </h4>

                {optionsPanel ? (
                  optionsPanel
                ) : (
                  <div className="text-xs text-[var(--muted)] space-y-2">
                    <p>Standard in-browser lossless compilation is active.</p>
                    <div className="inline-flex items-center gap-1.5 text-[var(--pine)] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero server upload active</span>
                    </div>
                  </div>
                )}

                {/* Progress Bar (if processing) */}
                {isProcessing && (
                  <div className="pt-2">
                    <Progress value={progressPercent} label="Processing in browser RAM..." />
                  </div>
                )}

                {/* ONE TERRACOTTA ACTION BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={onProcess}
                    disabled={isProcessing || files.length === 0}
                    className="btn-terracotta w-full text-base h-12"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span>{processButtonText}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. HOW TO USE (3 Numbered Steps) */}
      <section className="mb-14 border-t border-[var(--line)] pt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          How to use {tool.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stepsToRender.map((s) => (
            <div key={s.step} className="space-y-2 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[8px]">
              <span className="font-mono text-sm font-bold text-[var(--pine)]">
                Step {s.step}
              </span>
              <h4 className="text-base font-semibold text-[var(--ink)]">{s.title}</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURES */}
      <section className="mb-14 border-t border-[var(--line)] pt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          Key Features & Standards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresToRender.map((feat) => (
            <div key={feat.title} className="space-y-1.5 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[8px]">
              <h4 className="text-base font-semibold text-[var(--ink)]">{feat.title}</h4>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDION (5-8 Plain FAQs) */}
      {tool.faq && tool.faq.length > 0 && (
        <section className="mb-14 border-t border-[var(--line)] pt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-3xl">
            {tool.faq.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-[6px] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-sm sm:text-base text-[var(--ink)] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--muted)] transition-transform duration-150 shrink-0 ${
                        isOpen ? "rotate-180 text-[var(--pine)]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--line)] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. RELATED TOOLS (6 tools) */}
      {relatedTools.length > 0 && (
        <section className="border-t border-[var(--line)] pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Related Tools</h2>
            <Link
              href="/tools"
              className="text-sm font-semibold text-[var(--pine)] hover:underline flex items-center gap-1"
            >
              <span>Explore All 177+ Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.slug} tool={relTool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
