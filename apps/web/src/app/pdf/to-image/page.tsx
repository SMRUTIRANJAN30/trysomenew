"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Archive,
} from "lucide-react";
import confetti from "canvas-confetti";
import { inspectPDF } from "@/lib/pdf/merge";
import { convertPdfToImages, packageImagesAsZip, RenderedPageImage } from "@/lib/pdf/toImage";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [dpi, setDpi] = useState<number>(150);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [renderedImages, setRenderedImages] = useState<RenderedPageImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setError(null);
    setRenderedImages([]);

    if (!selected.name.toLowerCase().endsWith(".pdf") && selected.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      return;
    }

    try {
      const buf = await selected.arrayBuffer();
      const inspection = await inspectPDF(buf);
      if (!inspection.isValid) {
        setError("Could not read document. It may be encrypted or corrupted.");
        return;
      }

      setFile(selected);
      setBuffer(buf);
      setPageCount(inspection.pageCount);
    } catch (err) {
      console.error(err);
      setError("Failed to load PDF file.");
    }
  };

  const handleConvert = async () => {
    if (!buffer || !file) return;

    setError(null);
    setIsProcessing(true);
    setProgress(5);
    setStatusMessage("Initializing canvas renderer...");

    try {
      const images = await convertPdfToImages(
        buffer,
        {
          format,
          dpi,
          quality: format === "jpeg" ? 0.92 : undefined,
        },
        (prog, msg) => {
          setProgress(prog);
          setStatusMessage(msg);
        }
      );

      setRenderedImages(images);
      setIsProcessing(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Conversion failed. Please try a different DPI setting."
      );
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!file || renderedImages.length === 0) return;
    try {
      const zipBlob = await packageImagesAsZip(renderedImages, file.name, format);
      downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/i, "")}_images.zip`);
    } catch (err) {
      console.error("ZIP creation failed", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link
            href="/tools"
            className="text-xs font-semibold text-slate-400 hover:text-blue-400 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Convert PDF to JPG / PNG
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                High-resolution client-side canvas rasterization with zero cloud upload.
              </p>
            </div>
          </div>
        </div>

        <ProcessingBadge mode="local" />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box or Workspace */}
      {!file ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select a PDF file to convert</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose a PDF document to render pages as crisp JPG or PNG images.
          </p>
          <span className="mt-5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-500/20 transition-colors">
            Browse PDF File
          </span>
        </label>
      ) : (
        <div className="space-y-6">
          {/* File Card */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {pageCount} {pageCount === 1 ? "page" : "pages"} • {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setBuffer(null);
                setRenderedImages([]);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Choose different file
            </button>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format Selector */}
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Target Image Format:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat("png")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === "png"
                      ? "bg-purple-600/20 border-purple-500/50 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  PNG (Lossless & Crisp)
                </button>
                <button
                  onClick={() => setFormat("jpeg")}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    format === "jpeg"
                      ? "bg-purple-600/20 border-purple-500/50 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  JPG (Compact File Size)
                </button>
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Resolution & DPI:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 72, label: "72 DPI", sub: "Web" },
                  { value: 150, label: "150 DPI", sub: "Medium" },
                  { value: 300, label: "300 DPI", sub: "High / Print" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDpi(opt.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      dpi === opt.value
                        ? "bg-purple-600/20 border-purple-500/50 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div className="text-[10px] text-slate-400">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="bg-[#0e1626] border border-purple-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                  <span>{statusMessage}</span>
                </span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Rendered Images Grid */}
          {renderedImages.length > 0 && !isProcessing && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Rendered Pages ({renderedImages.length})
                </h3>
                {renderedImages.length > 1 && (
                  <button
                    onClick={handleDownloadZip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Download All as ZIP</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {renderedImages.map((img) => (
                  <div
                    key={img.pageNumber}
                    className="bg-[#0e1626] border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.dataUrl}
                        alt={`Page ${img.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Page {img.pageNumber}</span>
                      <button
                        onClick={() =>
                          downloadBlob(
                            img.blob,
                            `${file.name.replace(/\.pdf$/i, "")}_page_${img.pageNumber}.${format === "jpeg" ? "jpg" : "png"}`
                          )
                        }
                        className="p-1 text-purple-400 hover:text-white hover:bg-purple-600/30 rounded transition-colors"
                        title="Download page image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Action */}
          {renderedImages.length === 0 && !isProcessing && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Convert to {format.toUpperCase()}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
