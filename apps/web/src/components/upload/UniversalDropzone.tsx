"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Link as LinkIcon,
  Clipboard,
  X,
  CheckCircle2,
  AlertCircle,
  File,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface UniversalDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  ctaText?: string;
  helperText?: string;
}

export function UniversalDropzone({
  accept = "*",
  multiple = true,
  onFilesSelected,
  selectedFiles = [],
  onRemoveFile,
  ctaText = "Select Files",
  helperText = "or drag and drop files here",
}: UniversalDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        onFilesSelected(pastedFiles);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      // Reset input value so re-uploading same file triggers change
      e.target.value = "";
    }
  };

  // Handle URL fetch
  const handleFetchUrl = async () => {
    if (!urlValue.trim()) return;
    setUrlLoading(true);
    setUrlError(null);

    try {
      const response = await fetch(urlValue);
      if (!response.ok) throw new Error("Could not fetch file from the provided URL");
      const blob = await response.blob();
      const filename = urlValue.split("/").pop()?.split("?")[0] || "downloaded-file";
      const file = typeof window !== "undefined" && typeof (window as any).File === "function"
        ? new (window as any).File([blob], filename, { type: blob.type }) as File
        : Object.assign(blob, { name: filename, lastModified: Date.now() }) as unknown as File;
      onFilesSelected([file]);
      setUrlValue("");
      setUrlInputOpen(false);
    } catch (err: any) {
      setUrlError(err.message || "Failed to fetch from URL");
    } finally {
      setUrlLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 100% Width, Min-height 280px Dashed Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[280px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 text-center relative ${
          isDragging
            ? "border-[#F97316] bg-orange-500/5 shadow-lg shadow-orange-500/10"
            : "border-[var(--border-card)] bg-[var(--bg-card)] hover:border-[#F97316]/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto">
          {/* Central Cloud Icon */}
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-[#F97316] flex items-center justify-center mx-auto transition-transform hover:scale-110">
            <UploadCloud size={32} />
          </div>

          <div className="space-y-2">
            {/* Big Orange CTA Button (56px high, #F97316) */}
            <div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn-cta text-white cursor-pointer active:scale-95 transition-transform"
              >
                <UploadCloud size={20} />
                <span>{ctaText}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              {helperText}
            </p>
          </div>

          {/* Quick options: Paste & From URL */}
          <div className="flex items-center justify-center gap-3 pt-2 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-section)] border border-[var(--border-card)] font-medium">
              <Clipboard size={12} className="text-[#4F46E5]" />
              <span>Paste (Ctrl+V)</span>
            </span>
            <button
              type="button"
              onClick={() => setUrlInputOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-section)] hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--border-card)] text-[var(--text-main)] hover:border-[#4F46E5] font-medium transition-colors cursor-pointer"
            >
              <LinkIcon size={12} className="text-[#4F46E5]" />
              <span>From URL</span>
            </button>
          </div>
        </div>

        {/* URL Input Dropdown */}
        {urlInputOpen && (
          <div className="w-full max-w-md mt-4 p-3 rounded-xl bg-[var(--bg-section)] border border-[var(--border-card)] space-y-2 animate-in fade-in text-left">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-main)]">
              <span>Import file from web address</span>
              <button onClick={() => setUrlInputOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] outline-none focus:border-[#4F46E5]"
              />
              <button
                type="button"
                onClick={handleFetchUrl}
                disabled={urlLoading}
                className="px-3 py-2 rounded-lg bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] transition-colors disabled:opacity-50"
              >
                {urlLoading ? "Loading..." : "Fetch"}
              </button>
            </div>
            {urlError && <p className="text-[11px] text-red-500">{urlError}</p>}
          </div>
        )}
      </div>

      {/* Selected Files List with Thumbnails and Remove */}
      {selectedFiles.length > 0 && (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
            <span>Selected Files ({selectedFiles.length})</span>
            <span className="text-[var(--text-muted)] font-normal">
              Total: {formatBytes(selectedFiles.reduce((acc, f) => acc + f.size, 0))}
            </span>
          </div>

          <div className="divide-y divide-[var(--border-card)]">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center shrink-0">
                    <File size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text-main)] truncate max-w-sm">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(idx)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
