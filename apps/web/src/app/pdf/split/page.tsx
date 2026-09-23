"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Split,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Archive,
  Maximize2,
} from "lucide-react";
import confetti from "canvas-confetti";
import JSZip from "jszip";
import { inspectPDF } from "@/lib/pdf/merge";
import { extractPDFPages, burstPDFToIndividualPages, parsePageRangeString } from "@/lib/pdf/split";
import { standardizePdfToA4 } from "@/lib/pdf/a4";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<"range" | "burst">("range");
  const [rangeInput, setRangeInput] = useState<string>("1");
  const [convertToA4, setConvertToA4] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setError(null);
    setResultBlob(null);

    if (!selected.name.toLowerCase().endsWith(".pdf") && selected.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      return;
    }

    try {
      const buf = await selected.arrayBuffer();
      const inspection = await inspectPDF(buf);
      if (!inspection.isValid || inspection.pageCount === 0) {
        setError("Could not read document. It may be encrypted or corrupted.");
        return;
      }

      setFile(selected);
      setBuffer(buf);
      setPageCount(inspection.pageCount);
      setRangeInput(inspection.pageCount > 1 ? `1-${Math.min(3, inspection.pageCount)}` : "1");
    } catch (err) {
      console.error(err);
      setError("Failed to load PDF file.");
    }
  };

  const handleSplit = async () => {
    if (!buffer || !file) return;
    setError(null);
    setIsProcessing(true);
    setProgress(10);
    setStatusMessage("Preparing split operation...");

    try {
      if (splitMode === "range") {
        const indices = parsePageRangeString(rangeInput, pageCount);
        if (indices.length === 0) {
          throw new Error(`Invalid page range. Please specify pages between 1 and ${pageCount}.`);
        }

        let outputBytes = await extractPDFPages(buffer, indices, (prog, msg) => {
          setProgress(Math.round(prog * (convertToA4 ? 0.75 : 1)));
          setStatusMessage(msg);
        });

        if (convertToA4) {
          setStatusMessage("Standardizing extracted pages to standard A4 format...");
          setProgress(85);
          outputBytes = await standardizePdfToA4(outputBytes.buffer as ArrayBuffer, {
            fit: "contain",
            margin: 18,
          });
        }

        const blob = new Blob([outputBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const cleanName = file.name.replace(/\.pdf$/i, "");
        setResultBlob({ blob, filename: `${cleanName}_extracted${convertToA4 ? "_a4" : ""}.pdf` });
      } else {
        // Burst mode
        const pages = await burstPDFToIndividualPages(buffer, (prog, msg) => {
          setProgress(prog);
          setStatusMessage(msg);
        });

        setStatusMessage("Packaging into ZIP archive...");
        const zip = new JSZip();
        const cleanName = file.name.replace(/\.pdf$/i, "");
        for (const item of pages) {
          zip.file(`${cleanName}_page_${item.pageNumber}.pdf`, item.bytes);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResultBlob({ blob: zipBlob, filename: `${cleanName}_all_pages.zip` });
      }

      setIsProcessing(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Split failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Split & Extract PDF Pages
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Extract selected page ranges or separate all pages into individual files.
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

      {/* File Upload or Workspace */}
      {!file ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select a PDF file to split</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose a multi-page document to extract pages or burst into individual files.
          </p>
          <span className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-colors">
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
                setResultBlob(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Choose different file
            </button>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSplitMode("range")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                splitMode === "range"
                  ? "bg-indigo-600/15 border-indigo-500/40 text-white"
                  : "bg-[#0e1626] border-slate-800 text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              <div className="font-bold text-sm text-white">Extract Custom Page Range</div>
              <p className="text-xs text-slate-400 mt-1">
                Export specific pages into one new PDF (e.g. 1-3, 5, 8).
              </p>
            </button>

            <button
              onClick={() => setSplitMode("burst")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                splitMode === "burst"
                  ? "bg-indigo-600/15 border-indigo-500/40 text-white"
                  : "bg-[#0e1626] border-slate-800 text-slate-400 hover:bg-slate-800/60"
              }`}
            >
              <div className="font-bold text-sm text-white">Burst into Separate Files</div>
              <p className="text-xs text-slate-400 mt-1">
                Save each of the {pageCount} pages as its own 1-page PDF, bundled in a ZIP.
              </p>
            </button>
          </div>

          {/* Range Input Field */}
          {splitMode === "range" && (
            <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Pages to Extract (1 to {pageCount}):
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="Example: 1-3, 5, 8-10"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Hint: Separate page numbers with commas (<code>1, 3, 5</code>) or use hyphens for ranges (<code>2-6</code>).
              </p>

              {/* A4 Size Standardization Option */}
              <label className="flex items-center gap-2.5 pt-2 border-t border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={convertToA4}
                  onChange={(e) => setConvertToA4(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Maximize2 size={13} className="text-indigo-400" />
                  Standardize extracted pages to A4 format (595 × 842 pt)
                </span>
              </label>
            </div>
          )}

          {/* Processing Progress */}
          {isProcessing && (
            <div className="bg-[#0e1626] border border-indigo-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>{statusMessage}</span>
                </span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Download Card */}
          {resultBlob && !isProcessing && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Extraction Successful!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ready to download: {resultBlob.filename} ({formatBytes(resultBlob.blob.size)})
                </p>
              </div>
              <button
                onClick={() => downloadBlob(resultBlob.blob, resultBlob.filename)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Extracted File</span>
              </button>
            </div>
          )}

          {/* Action Trigger */}
          {!resultBlob && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                {splitMode === "burst" ? <Archive className="w-4 h-4" /> : <Split className="w-4 h-4" />}
                <span>
                  {splitMode === "burst" ? "Burst All Pages to ZIP" : "Extract Selected Pages"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
