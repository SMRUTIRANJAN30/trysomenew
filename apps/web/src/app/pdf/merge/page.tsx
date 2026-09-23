"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  UploadCloud,
  FileText,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowLeft,
  Sparkles,
  Maximize2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { mergePDFs, inspectPDF, PDFSourceItem } from "@/lib/pdf/merge";
import { standardizePdfToA4 } from "@/lib/pdf/a4";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";
import { DraggableList } from "@/components/tools/DraggableList";

export default function MergePdfPage() {
  const [items, setItems] = useState<PDFSourceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A4 conversion options
  const [convertToA4, setConvertToA4] = useState(false);
  const [a4Orientation, setA4Orientation] = useState<"auto" | "portrait" | "landscape">("auto");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const newItems: PDFSourceItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
        setError(`"${file.name}" is not a valid PDF file. Please select PDF documents.`);
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const inspection = await inspectPDF(buffer);
        if (!inspection.isValid) {
          setError(`"${file.name}" could not be parsed. The file might be corrupted or password-protected.`);
          continue;
        }

        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          buffer,
          pageCount: inspection.pageCount,
        });
      } catch (err) {
        console.error("Failed to read file", err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setMergedBlob(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      setError("Please add at least 2 PDF documents to merge.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setProgress(5);
    setStatusMessage("Starting client-side merge...");

    try {
      let mergedBytes = await mergePDFs(items, (prog, msg) => {
        setProgress(Math.round(prog * (convertToA4 ? 0.7 : 1)));
        setStatusMessage(msg);
      });

      if (convertToA4) {
        setStatusMessage("Standardizing merged pages to standard A4 format...");
        setProgress(85);
        mergedBytes = await standardizePdfToA4(mergedBytes.buffer as ArrayBuffer, {
          orientation: a4Orientation,
          fit: "contain",
          margin: 18,
        });
      }

      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setMergedBlob(blob);
      setIsProcessing(false);
      setProgress(100);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      console.error("Merge error:", err);
      setError(err instanceof Error ? err.message : "Failed to merge PDF files.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadBlob(mergedBlob, `trysomenew_merged${convertToA4 ? "_a4" : ""}.pdf`);
  };

  const totalPages = items.reduce((sum, item) => sum + (item.pageCount || 0), 0);
  const totalSize = items.reduce((sum, item) => sum + item.size, 0);

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
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Merge PDF Documents
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Combine multiple PDFs in your chosen order with drag & drop and optional A4 size standardization.
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

      {/* Upload & Reorder Area */}
      {items.length === 0 ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select PDF files to merge</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose two or more PDFs from your computer. You can reorder them with drag-and-drop or arrows.
          </p>
          <span className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-colors">
            Browse PDF Files
          </span>
        </label>
      ) : (
        <div className="space-y-6">
          {/* File summary & Add more button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e1626] p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-300 space-x-2">
              <span className="font-semibold text-white">{items.length} files selected</span>
              <span className="text-slate-600">•</span>
              <span>Total pages: <strong className="text-white">{totalPages}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Total size: <strong className="text-white">{formatBytes(totalSize)}</strong></span>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors border border-slate-700">
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Add More PDFs</span>
            </label>
          </div>

          {/* A4 Standardization Option */}
          <div className="glass rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={convertToA4}
                onChange={(e) => setConvertToA4(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded"
              />
              <div>
                <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Maximize2 size={13} className="text-blue-400" />
                  Standardize all pages to A4 Size (595 × 842 pt)
                </p>
                <p className="text-[11px] text-gray-500">
                  Rescales all merged pages to uniform A4 dimensions with proportional margins
                </p>
              </div>
            </label>

            {convertToA4 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Orientation:</span>
                <select
                  value={a4Orientation}
                  onChange={(e) => setA4Orientation(e.target.value as any)}
                  className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="auto">Auto per page</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            )}
          </div>

          {/* Draggable/Reorderable Item List */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400">
              ⇅ Drag items or use arrows to change the merge sequence:
            </p>
            <DraggableList
              items={items}
              onReorder={setItems}
              onRemove={removeItem}
              renderItem={(item) => (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <p className="text-xs text-slate-400">
                      {item.pageCount} {item.pageCount === 1 ? "page" : "pages"} • {formatBytes(item.size)}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="bg-[#0e1626] border border-blue-500/30 rounded-2xl p-6 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                  <span>{statusMessage}</span>
                </span>
                <span className="font-bold text-white">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Result & Action */}
          {mergedBlob && !isProcessing && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Merge Completed Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Your {items.length} documents have been merged into a single {formatBytes(mergedBlob.size)} PDF
                  {convertToA4 ? " in standard A4 format" : ""}.
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </button>
            </div>
          )}

          {/* Action Trigger */}
          {!mergedBlob && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleMerge}
                disabled={isProcessing || items.length < 2}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Merge {items.length} PDF Files {convertToA4 ? "as A4" : ""}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
