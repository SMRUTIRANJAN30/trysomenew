"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSearch,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Save,
  Tag,
  Calendar,
  Layers,
  Maximize2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { getPDFMetadata, updatePDFMetadata, PDFMetadataInfo } from "@/lib/pdf/metadata";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

export default function PdfViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [metadata, setMetadata] = useState<PDFMetadataInfo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setError(null);
    setSavedSuccess(false);

    if (!selected.name.toLowerCase().endsWith(".pdf") && selected.type !== "application/pdf") {
      setError("Please select a valid PDF document.");
      return;
    }

    try {
      const buf = await selected.arrayBuffer();
      const meta = await getPDFMetadata(buf);
      setFile(selected);
      setBuffer(buf);
      setMetadata(meta);
      setEditTitle(meta.title || "");
      setEditAuthor(meta.author || "");
      setEditSubject(meta.subject || "");
    } catch (err) {
      console.error(err);
      setError("Failed to inspect PDF metadata.");
    }
  };

  const handleSaveMetadata = async () => {
    if (!buffer || !file) return;
    setIsSaving(true);
    setError(null);

    try {
      const updatedBytes = await updatePDFMetadata(buffer, {
        title: editTitle,
        author: editAuthor,
        subject: editSubject,
      });

      const updatedBlob = new Blob([updatedBytes as unknown as BlobPart], { type: "application/pdf" });
      downloadBlob(updatedBlob, `${file.name.replace(/\.pdf$/i, "")}_updated_metadata.pdf`);

      setIsSaving(false);
      setSavedSuccess(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update metadata.");
      setIsSaving(false);
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
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                PDF Viewer & Metadata Inspector
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Inspect internal catalog properties, page geometry, and update document headers.
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
      {!file || !metadata ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Select a PDF file to inspect</h3>
          <p className="text-sm text-slate-400 mt-1">
            Read document authors, title tags, page geometry, and creation timestamps.
          </p>
          <span className="mt-5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-cyan-500/20 transition-colors">
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
                  {metadata.pageCount} {metadata.pageCount === 1 ? "page" : "pages"} • {formatBytes(metadata.fileSizeBytes)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setBuffer(null);
                setMetadata(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Choose different file
            </button>
          </div>

          {/* Metadata Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Pages</span>
              </div>
              <div className="text-white font-bold text-base">{metadata.pageCount}</div>
            </div>

            <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Format</span>
              </div>
              <div className="text-white font-bold text-sm truncate">
                {metadata.dimensions?.standardName || "Standard"}
              </div>
              <div className="text-[10px] text-slate-500">
                {metadata.dimensions ? `${metadata.dimensions.width} × ${metadata.dimensions.height} pt` : ""}
              </div>
            </div>

            <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Created</span>
              </div>
              <div className="text-white font-semibold text-xs truncate">
                {metadata.creationDate ? new Date(metadata.creationDate).toLocaleDateString() : "Unknown"}
              </div>
            </div>

            <div className="bg-[#0e1626] border border-slate-800 rounded-xl p-4">
              <div className="text-slate-500 text-xs flex items-center gap-1.5 mb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Producer</span>
              </div>
              <div className="text-white font-semibold text-xs truncate">
                {metadata.producer || "Not specified"}
              </div>
            </div>
          </div>

          {/* Editable Metadata Form */}
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Edit Document Properties</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Author</label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  placeholder="Author or organization name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  placeholder="Subject or summary keywords"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Updated PDF downloaded with new metadata!</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveMetadata}
                disabled={isSaving}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save & Download Updated PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
