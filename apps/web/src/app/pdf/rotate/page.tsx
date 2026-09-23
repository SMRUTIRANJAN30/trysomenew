"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  RotateCcw,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { inspectPDF } from "@/lib/pdf/merge";
import { rotatePDFPages } from "@/lib/pdf/rotate";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setError(null);
    setResultBlob(null);
    setRotationAngle(0);

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

  const rotate = (delta: number) => {
    setRotationAngle((prev) => (prev + delta + 360) % 360);
    setResultBlob(null);
  };

  const handleApplyRotation = async () => {
    if (!buffer || !file) return;
    if (rotationAngle === 0) {
      setError("Please rotate the document first before saving.");
      return;
    }

    setError(null);
    setIsProcessing(true);
    setStatusMessage("Applying page orientation...");

    try {
      const rotatedBytes = await rotatePDFPages(buffer, rotationAngle, (_, msg) => {
        setStatusMessage(msg);
      });

      const blob = new Blob([rotatedBytes as unknown as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
      setIsProcessing(false);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Rotation failed.");
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
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Rotate PDF Pages
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Fix sideways or upside-down pages with instant client-side rotation.
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
        <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select a PDF file to rotate</h3>
          <p className="text-sm text-slate-400 mt-1">
            Choose a document to orient 90°, 180°, or 270°.
          </p>
          <span className="mt-5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-500/20 transition-colors">
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

          {/* Live Preview Representation */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Document Orientation Preview
            </div>

            {/* Simulated Animated Page */}
            <div className="relative w-40 h-52 flex items-center justify-center">
              <div
                className="w-36 h-48 bg-slate-100 rounded-xl shadow-2xl border-2 border-slate-300 flex flex-col justify-between p-4 transition-transform duration-300"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <div className="space-y-2">
                  <div className="w-12 h-2 bg-slate-400 rounded" />
                  <div className="w-full h-1 bg-slate-300 rounded" />
                  <div className="w-full h-1 bg-slate-300 rounded" />
                  <div className="w-3/4 h-1 bg-slate-300 rounded" />
                </div>
                <div className="text-center font-bold text-slate-500 text-xs tracking-wider">
                  TOP ↑
                </div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-300 rounded" />
                  <div className="w-1/2 h-1 bg-slate-300 rounded" />
                </div>
              </div>
            </div>

            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Rotation:</span>
              <span className="text-amber-400 font-mono text-base">{rotationAngle}°</span>
            </div>

            {/* Rotation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => rotate(-90)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>90° Left</span>
              </button>

              <button
                onClick={() => rotate(90)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-4 h-4 text-amber-400" />
                <span>90° Right</span>
              </button>

              <button
                onClick={() => rotate(180)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>180° Flip</span>
              </button>

              {rotationAngle !== 0 && (
                <button
                  onClick={() => setRotationAngle(0)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Status Message */}
          {isProcessing && (
            <div className="bg-[#0e1626] border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-300">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Download Output */}
          {resultBlob && !isProcessing && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Document Rotated Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Saved with {rotationAngle}° orientation ({formatBytes(resultBlob.size)}).
                </p>
              </div>
              <button
                onClick={() => downloadBlob(resultBlob, "trysomenew_rotated.pdf")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Rotated PDF</span>
              </button>
            </div>
          )}

          {/* Trigger Action */}
          {!resultBlob && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleApplyRotation}
                disabled={isProcessing || rotationAngle === 0}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Save Rotated PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
