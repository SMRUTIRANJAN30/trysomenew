"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { ToolDefinition, TOOLS } from "@/lib/toolsData";
import { UniversalDropzone } from "@/components/upload/UniversalDropzone";
import { ToolCard } from "@/components/common/ToolCard";
import { getCategoryTheme } from "@/lib/categoryTheme";

export interface ToolPageStep {
  step: number;
  title: string;
  desc: string;
}

export interface ToolPageFaq {
  q: string;
  a: string;
}

export interface ToolPageTemplateProps {
  tool: ToolDefinition;
  h1Title?: string;
  introText?: string;
  actionButtonText?: string;
  onProcess?: (files: File[]) => Promise<Blob | File | void>;
  optionsPanel?: React.ReactNode;
  howToUseSteps?: ToolPageStep[];
  features?: { title: string; desc: string }[];
  faqs?: ToolPageFaq[];
  relatedToolIds?: string[];
  seoArticle?: React.ReactNode;
}

export function ToolPageTemplate({
  tool,
  h1Title,
  introText,
  actionButtonText = "Convert Now",
  onProcess,
  optionsPanel,
  howToUseSteps,
  features,
  faqs,
  relatedToolIds,
  seoArticle,
}: ToolPageTemplateProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadBlob, setDownloadBlob] = useState<Blob | File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const theme = getCategoryTheme(tool.category);

  // Default steps
  const steps: ToolPageStep[] = howToUseSteps || [
    { step: 1, title: "Select or Drag & Drop", desc: `Upload your files from your device, paste from clipboard, or drag directly into the dropzone.` },
    { step: 2, title: "Configure & Process", desc: `Adjust preferences in the options panel, then click ${actionButtonText} to run instant browser compute.` },
    { step: 3, title: "Download Result", desc: `Save your processed output instantly to your device with zero cloud storage and full privacy.` },
  ];

  // Default FAQs
  const toolFaqs: ToolPageFaq[] = faqs || [
    { q: `Is the ${tool.name} completely free?`, a: `Yes, ${tool.name} is 100% free with no file limits, no registration required, and no watermarks added.` },
    { q: `Are my files uploaded or stored on your servers?`, a: `No. ${tool.name} processes files 100% client-side inside your browser memory using WebAssembly and HTML5 APIs. Your data never leaves your device.` },
    { q: `Does this tool work on mobile devices?`, a: `Yes, trysomenew is designed mobile-first and works seamlessly on iPhone, iPad, Android, Mac, and Windows.` },
    { q: `What file formats are supported?`, a: `This tool supports ${tool.inputExtensions?.join(", ") || "standard document and image"} formats.` },
    { q: `Is there a maximum file size limit?`, a: `Since processing happens directly on your device hardware, files up to 200MB+ can be handled comfortably depending on your device's memory.` },
  ];

  // 6 Related Tools
  const relatedTools = useMemo(() => {
    if (relatedToolIds && relatedToolIds.length > 0) {
      return TOOLS.filter((t) => relatedToolIds.includes(t.id) && t.status === "ready").slice(0, 6);
    }
    return TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id && t.status === "ready").slice(0, 6);
  }, [relatedToolIds, tool.category, tool.id]);

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    setDownloadBlob(null);
    setDownloadUrl(null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadBlob(null);
    setDownloadUrl(null);
  };

  const handleRunProcess = async () => {
    if (files.length === 0 || !onProcess) return;
    setIsProcessing(true);
    setProgress(20);
    setError(null);

    try {
      const timer = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 15 : p));
      }, 150);

      const result = await onProcess(files);
      clearInterval(timer);
      setProgress(100);

      if (result instanceof Blob) {
        setDownloadBlob(result);
        const url = URL.createObjectURL(result);
        setDownloadUrl(url);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://trysomenew.com" },
          { "@type": "ListItem", position: 2, name: theme.name, item: `https://trysomenew.com/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `https://trysomenew.com${tool.href}` },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: `${tool.name} — trysomenew`,
        operatingSystem: "Web Browser",
        applicationCategory: "BusinessApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: tool.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: toolFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="w-full">
      {/* Injected Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* 1. BREADCRUMB NAVIGATION */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text-main)] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/tools" className="hover:text-[var(--text-main)] transition-colors">
            {theme.name}
          </Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-[var(--text-main)] truncate">{tool.name}</span>
        </nav>

        {/* 2. HEADER: H1 + SHORT INTRO */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
            {h1Title || `${tool.name} — Free Online`}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {introText || tool.description}
          </p>

          <div className="flex items-center justify-center gap-3 pt-1 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={14} /> Zero Cloud Storage
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
              <Zap size={14} /> 100% Client-Side Speed
            </span>
          </div>
        </div>

        {/* 3. TOOL INTERACTIVE WORKSPACE (Dropzone + 320px Options Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Upload / Viewer Column */}
          <div className={`${optionsPanel && files.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} space-y-4`}>
            <UniversalDropzone
              accept={tool.inputExtensions?.map((e) => `.${e}`).join(",") || "*"}
              multiple={true}
              onFilesSelected={handleFilesSelected}
              selectedFiles={files}
              onRemoveFile={handleRemoveFile}
              ctaText={`Select ${tool.inputExtensions?.[0]?.toUpperCase() || "Files"}`}
              helperText={`or drag and drop your ${tool.inputExtensions?.join(", ") || "files"} here`}
            />

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* If no options panel, show primary CTA directly */}
            {!optionsPanel && files.length > 0 && (
              <div className="flex items-center justify-center pt-2">
                {!downloadUrl ? (
                  <button
                    onClick={handleRunProcess}
                    disabled={isProcessing}
                    className="btn-cta text-white"
                  >
                    {isProcessing ? "Processing..." : actionButtonText}
                  </button>
                ) : (
                  <a
                    href={downloadUrl}
                    download={`processed-${tool.id}`}
                    className="btn-cta text-white bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
                  >
                    <Download size={20} />
                    <span>Download Ready File</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Options Sidebar (320px width) */}
          {optionsPanel && files.length > 0 && (
            <div className="lg:col-span-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-5 space-y-5 sticky top-24 shadow-sm">
              <h3 className="text-sm font-bold text-[var(--text-main)] border-b border-[var(--border-card)] pb-3">
                Tool Options
              </h3>

              {optionsPanel}

              {/* Progress bar */}
              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-main)]">
                    <span>Processing in browser...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-section)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#4F46E5] to-[#F97316] transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action / Download Button */}
              <div className="pt-2">
                {!downloadUrl ? (
                  <button
                    onClick={handleRunProcess}
                    disabled={isProcessing || files.length === 0}
                    className="w-full btn-cta text-white justify-center shadow-lg"
                  >
                    {isProcessing ? "Processing..." : actionButtonText}
                  </button>
                ) : (
                  <a
                    href={downloadUrl}
                    download={`processed-${tool.id}`}
                    className="w-full btn-cta text-white bg-emerald-600 hover:bg-emerald-700 justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <Download size={20} />
                    <span>Download Ready File</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. HOW TO USE (3 Steps with Numbers) */}
        <section className="pt-8 border-t border-[var(--border-card)] space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              How to Use {tool.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Follow these 3 easy steps to complete your task in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-2 relative"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] font-extrabold text-lg flex items-center justify-center">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURES LIST */}
        {features && features.length > 0 && (
          <section className="pt-8 border-t border-[var(--border-card)] space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                Key Features
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <h4 className="text-sm font-bold text-[var(--text-main)]">{f.title}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-6">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. FAQ ACCORDION (5-8 Questions) */}
        <section className="pt-8 border-t border-[var(--border-card)] max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Common questions about using {tool.name}.
            </p>
          </div>

          <div className="space-y-3">
            {toolFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-bold text-sm text-[var(--text-main)] flex items-center justify-between gap-4 cursor-pointer hover:text-[#4F46E5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#4F46E5]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-card)]/50 pt-3 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. RELATED TOOLS (6 Cards) */}
        {relatedTools.length > 0 && (
          <section className="pt-8 border-t border-[var(--border-card)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                  Related Tools
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Other free productivity tools you might find useful.
                </p>
              </div>
              <Link href="/tools" className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1">
                <span>View all tools</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </section>
        )}

        {/* 8. 300-500 WORDS OF UNIQUE SEO CONTENT */}
        <section className="pt-8 border-t border-[var(--border-card)] text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed space-y-4 max-w-4xl mx-auto">
          {seoArticle ? (
            seoArticle
          ) : (
            <div className="space-y-4 bg-[var(--bg-section)] p-6 rounded-2xl border border-[var(--border-card)]">
              <h3 className="text-base font-bold text-[var(--text-main)]">
                About {tool.name} Online on trysomenew
              </h3>
              <p>
                {tool.name} on trysomenew is an ultra-fast, privacy-first web utility engineered to process files directly inside your browser. By utilizing modern web standards such as WebAssembly, HTML5 Canvas, and WebCrypto, our platform eliminates the requirement of uploading your private documents to third-party cloud servers.
              </p>
              <p>
                Unlike traditional document converter websites like Smallpdf or iLovePDF that queue your documents on remote servers, trysomenew executes memory operations instantly on your local hardware. This ensures zero wait times, complete compliance with enterprise data privacy standards, and no risk of sensitive records being retained.
              </p>
              <p>
                Whether you are working from a desktop workstation, a laptop, an iPad, or a smartphone, our responsive interface adapts to your screen size. All processing is 100% free with no watermark overlays, no subscriptions, and no email sign-ups required.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
