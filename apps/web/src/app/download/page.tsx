"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Video,
  Music,
  FileDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Progress } from "@/components/ui/Progress";

interface DownloadResult {
  platform: "youtube" | "instagram" | "tiktok" | "terabox" | "twitter" | "facebook" | "direct" | "unknown";
  title: string;
  thumbnail?: string;
  author?: string;
  downloads: {
    quality: string;
    format: "mp4" | "mp3" | "jpg" | "bin";
    url: string;
    label: string;
  }[];
}

export default function UniversalDownloaderPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<string>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Auto-detect platform from URL input
  useEffect(() => {
    const url = inputUrl.trim().toLowerCase();
    if (!url) {
      setDetectedPlatform("auto");
      return;
    }

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setDetectedPlatform("youtube");
    } else if (url.includes("instagram.com")) {
      setDetectedPlatform("instagram");
    } else if (url.includes("tiktok.com")) {
      setDetectedPlatform("tiktok");
    } else if (
      url.includes("terabox.com") ||
      url.includes("teraboxapp.com") ||
      url.includes("1024tera.com") ||
      url.includes("freeterabox.com")
    ) {
      setDetectedPlatform("terabox");
    } else if (url.includes("twitter.com") || url.includes("x.com")) {
      setDetectedPlatform("twitter");
    } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
      setDetectedPlatform("facebook");
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      setDetectedPlatform("direct");
    } else {
      setDetectedPlatform("auto");
    }
  }, [inputUrl]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputUrl(text.trim());
    } catch {
      alert("Please allow clipboard access or paste directly into the box.");
    }
  };

  const handleFetchMedia = async () => {
    if (!inputUrl.trim()) {
      setErrorMessage("Please enter a link to download.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgressPercent(20);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      setProgressPercent(60);

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to parse download link.");
      }

      setProgressPercent(100);
      setResult(data.media);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || "Could not retrieve media from this link.");
    }
  };

  const handleTriggerDownload = (item: DownloadResult["downloads"][0]) => {
    setDownloadingFormat(item.quality);

    // If direct link or stream
    const targetUrl = item.url;
    const safeFilename = `${result?.title || "download"}.${item.format === "bin" ? "zip" : item.format}`;

    // Create a temporary anchor to trigger browser download
    const link = document.createElement("a");
    link.href = `/api/download?url=${encodeURIComponent(targetUrl)}&filename=${encodeURIComponent(safeFilename)}`;
    link.download = safeFilename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFormat(null);
    }, 2000);
  };

  const platformBadges: { id: string; label: string; icon: string }[] = [
    { id: "terabox", label: "TeraBox Links", icon: "📦" },
    { id: "youtube", label: "YouTube HD / MP3", icon: "▶️" },
    { id: "instagram", label: "Instagram Reels", icon: "📸" },
    { id: "tiktok", label: "TikTok (No Watermark)", icon: "🎵" },
    { id: "direct", label: "Direct File Links", icon: "🌐" },
  ];

  const faqs = [
    {
      question: "How do I download files from a TeraBox link?",
      answer:
        "Simply paste your shared TeraBox link into the input box above and click 'Extract Download Links'. Our engine parses the shared file metadata and generates a high-speed direct stream link.",
    },
    {
      question: "Can I download YouTube videos as MP3 audio files?",
      answer:
        "Yes! You can choose between high-definition MP4 video (1080p, 720p) or extract the audio track as a high-quality 320 kbps MP3 file.",
    },
    {
      question: "Are TikTok video downloads free from watermarks?",
      answer:
        "Yes. Our TikTok processor extracts the raw high-definition stream directly, ensuring you download clean video without the floating TikTok logo watermark.",
    },
    {
      question: "Can I download any generic file link from the internet?",
      answer:
        "Yes. If you have a direct URL to a PDF, ZIP archive, image, video, APK, or document, paste it above to trigger a direct in-browser download with proper content headers.",
    },
    {
      question: "Is there any limit on how many files I can download?",
      answer:
        "No. You can download unlimited files and links completely free without creating an account or paying for subscriptions.",
    },
  ];

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      <Breadcrumb
        items={[
          { label: "Tools", href: "/tools" },
          { label: "Media & Link Downloader" },
        ]}
      />

      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <Download className="w-3.5 h-3.5" />
          <span>Universal Downloader</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold text-[var(--ink)]">
          Universal Media & Link Downloader
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
          Download videos, audio, photos and files from TeraBox, YouTube, Instagram Reels, TikTok
          (no watermark), and direct file URLs. 100% free and fast.
        </p>

        {/* Supported Platform Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {platformBadges.map((badge) => (
            <span
              key={badge.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[6px] border transition-colors ${
                detectedPlatform === badge.id
                  ? "bg-[var(--pine-tint)] border-[var(--pine)] text-[var(--pine)] font-semibold"
                  : "bg-[var(--surface)] border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Downloader Input Box */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 sm:p-8 mb-12 shadow-xs space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Paste link to video, audio, TeraBox or file
          </label>
          <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchMedia()}
                placeholder="https://www.youtube.com/watch?v=... or TeraBox link..."
                className="pl-9 pr-20 h-12 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-[4px] bg-[var(--sunken)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)]"
              >
                Paste
              </button>
            </div>

            {/* THE ONE TERRACOTTA BUTTON */}
            <button
              onClick={handleFetchMedia}
              disabled={isProcessing || !inputUrl.trim()}
              className="btn-terracotta text-sm sm:text-base h-12 px-6 shrink-0"
            >
              {isProcessing ? "Extracting..." : "Download Media"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-[var(--error-tint)] text-[var(--error)] rounded-[6px] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isProcessing && (
          <div className="pt-2">
            <Progress value={progressPercent} label="Extracting high-speed download streams..." />
          </div>
        )}

        {/* Result Container */}
        {result && (
          <div className="pt-6 border-t border-[var(--line)] space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {result.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="w-16 h-16 rounded-[6px] object-cover border border-[var(--line)] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-[6px] bg-[var(--sunken)] flex items-center justify-center text-[var(--pine)] shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--ink)] line-clamp-1">
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-0.5">
                    <span className="capitalize font-medium text-[var(--pine)]">
                      {result.platform} Link
                    </span>
                    {result.author && (
                      <>
                        <span>•</span>
                        <span>{result.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  setInputUrl("");
                }}
                className="btn-secondary text-xs h-8 px-3 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Link</span>
              </button>
            </div>

            {/* Download Options Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Available Download Options
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.downloads.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-[var(--sunken)] border border-[var(--line)] rounded-[6px] hover:border-[var(--pine)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.format === "mp4" ? (
                        <Video className="w-4 h-4 text-[var(--pine)] shrink-0" />
                      ) : item.format === "mp3" ? (
                        <Music className="w-4 h-4 text-[var(--terracotta)] shrink-0" />
                      ) : (
                        <FileDown className="w-4 h-4 text-[var(--ink)] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[var(--ink)] truncate">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[var(--muted)]">{item.quality}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTriggerDownload(item)}
                      disabled={downloadingFormat === item.quality}
                      className="btn-pine text-xs h-8 px-3 shrink-0 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingFormat === item.quality ? "Starting..." : "Download"}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How to Use Section (3 Steps) */}
      <section className="mb-14 border-t border-[var(--line)] pt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">
          How to download videos & files in 3 steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[8px]">
            <span className="font-mono text-sm font-bold text-[var(--pine)]">Step 01</span>
            <h4 className="text-base font-semibold text-[var(--ink)]">Copy the link</h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Copy the video or file link from YouTube, Instagram, TikTok, TeraBox, or any website.
            </p>
          </div>

          <div className="space-y-2 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[8px]">
            <span className="font-mono text-sm font-bold text-[var(--pine)]">Step 02</span>
            <h4 className="text-base font-semibold text-[var(--ink)]">Paste & extract</h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Paste the link into the box above. Our engine instantly analyzes and prepares the media formats.
            </p>
          </div>

          <div className="space-y-2 p-5 bg-[var(--surface)] border border-[var(--line)] rounded-[8px]">
            <span className="font-mono text-sm font-bold text-[var(--pine)]">Step 03</span>
            <h4 className="text-base font-semibold text-[var(--ink)]">Save directly</h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Select your preferred resolution (MP4 HD, MP3 audio, or original file) and click Download.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mb-14 border-t border-[var(--line)] pt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 max-w-3xl">
          {faqs.map((faq, idx) => {
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
    </div>
  );
}
