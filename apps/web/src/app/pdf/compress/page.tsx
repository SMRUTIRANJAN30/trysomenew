"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Minimize2,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { inspectPDF } from "@/lib/pdf/merge";
import { compressPDF, CompressionLevel, CompressionResult } from "@/lib/pdf/compress";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setError(null);
    setResult(null);

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

  const handleCompress = async () => {
    if (!buffer || !file) return;

    setError(null);
    setIsProcessing(true);
    setProgress(15);
    setStatusMessage("Analyzing stream structures...");

    try {
      const res = await compressPDF(buffer, level, (prog, msg) => {
        setProgress(prog);
        setStatusMessage(msg);
      });

      setResult(res);
      setIsProcessing(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Compression failed.");
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Minimize2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Compress PDF
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Reduce PDF file size without sacrificing readability.
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
        <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select a PDF file to compress</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose a document to optimize object streams and reduce bytes.
          </p>
          <span className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 transition-colors">
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
                  {pageCount} {pageCount === 1 ? "page" : "pages"} • Original size: {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setBuffer(null);
                setResult(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Choose different file
            </button>
          </div>

          {/* Preset Compression Levels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                id: "recommended",
                name: "Recommended Compression",
                desc: "Balanced optimization. Ideal for emailing and web forms.",
                badge: "Default",
              },
              {
                id: "maximum",
                name: "Maximum Compression",
                desc: "High reduction, aggressively strips non-essential metadata streams.",
                badge: "Smallest Size",
              },
              {
                id: "light",
                name: "Light Compression",
                desc: "Gentle stream consolidation while preserving all document tags.",
                badge: "Highest Quality",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setLevel(p.id as CompressionLevel)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  level === p.id
                    ? "bg-emerald-600/15 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10"
                    : "bg-[#0e1626] border-slate-800 text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {p.badge}
                  </span>
                  <div className="font-bold text-sm text-white mt-2">{p.name}</div>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="bg-[#0e1626] border border-emerald-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{statusMessage}</span>
                </span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results Comparison Card */}
          {result && !isProcessing && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Document Optimized!</h3>
                <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                  <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Before</div>
                    <div className="text-white font-bold">{formatBytes(result.originalSize)}</div>
                  </div>
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-500/30">
                    <div className="text-emerald-400 font-semibold">After</div>
                    <div className="text-emerald-300 font-bold">{formatBytes(result.newSize)}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  downloadBlob(
                    new Blob([result.bytes as unknown as BlobPart], { type: "application/pdf" }),
                    "trysomenew_compressed.pdf"
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </button>
            </div>
          )}

          {/* Action Trigger */}
          {!result && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Optimize & Compress PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
