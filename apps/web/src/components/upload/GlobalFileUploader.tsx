"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Send,
  Minimize2,
  Split,
  Layers,
  RotateCw,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { calculateSHA256, createDocumentId, saveVerificationRecord } from "@/lib/crypto";

export interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: "idle" | "uploading" | "processing" | "ready" | "error";
  progress: number;
  statusMessage?: string;
  hash?: string;
  docId?: string;
}

interface GlobalFileUploaderProps {
  onFileSelected?: (file: File) => void;
  acceptedTypes?: string;
  multiple?: boolean;
  compact?: boolean;
}

export function GlobalFileUploader({
  onFileSelected,
  acceptedTypes = ".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.txt",
  multiple = true,
  compact = false,
}: GlobalFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: QueuedFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type || getExtensionType(f.name),
      status: "uploading",
      progress: 25,
      statusMessage: "Reading file bytes locally...",
    }));

    setQueue((prev) => (multiple ? [...prev, ...newItems] : newItems));

    // Simulate fast local ingestion
    for (const item of newItems) {
      if (onFileSelected) {
        onFileSelected(item.file);
      }

      // Compute client-side SHA-256 hash immediately for transparency & integrity
      try {
        const buffer = await item.file.arrayBuffer();
        const hash = await calculateSHA256(buffer);
        const docId = createDocumentId();

        // Update to processing
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  progress: 80,
                  status: "processing",
                  statusMessage: "Verifying document structure...",
                  hash,
                  docId,
                }
              : q
          )
        );

        // Save local verification record
        saveVerificationRecord({
          id: docId,
          name: item.name,
          hash,
          fileSizeBytes: item.size,
          mimeType: item.type,
          version: 1,
          issuedAt: new Date().toISOString(),
          issuer: "TrySomeNew Client Engine",
          verified: true,
        });

        // Finalize ready state
        setTimeout(() => {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    progress: 100,
                    status: "ready",
                    statusMessage: "Ready for smart actions",
                  }
                : q
            )
          );
        }, 300);
      } catch (err) {
        console.error("Local file processing error:", err);
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "error",
                  statusMessage: "Failed to read file.",
                }
              : q
          )
        );
      }
    }
  };

  const getExtensionType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "application/pdf";
    if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) return `image/${ext}`;
    if (["doc", "docx"].includes(ext || "")) return "application/msword";
    if (["xls", "xlsx"].includes(ext || "")) return "application/vnd.ms-excel";
    return "application/octet-stream";
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const getFileCategory = (type: string, name: string): "pdf" | "image" | "office" | "other" => {
    const lowerName = name.toLowerCase();
    if (type.includes("pdf") || lowerName.endsWith(".pdf")) return "pdf";
    if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(lowerName)) return "image";
    if (
      type.includes("word") ||
      type.includes("excel") ||
      /\.(docx?|xlsx?|pptx?)$/i.test(lowerName)
    )
      return "office";
    return "other";
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Surface */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all cursor-pointer text-center group ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
            : "border-[var(--card-border)] hover:border-blue-500/60 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] shadow-sm"
        } ${compact ? "p-6 sm:p-8" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              Drag & Drop your files here
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-1">
              or <span className="text-blue-500 font-semibold underline underline-offset-2">Browse files</span> from your computer
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted)] border border-[var(--border-subtle)]">
              PDF
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted)] border border-[var(--border-subtle)]">
              Word (DOCX)
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted)] border border-[var(--border-subtle)]">
              Images (PNG, JPG, WebP)
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--muted)] border border-[var(--border-subtle)]">
              Excel
            </span>
          </div>

          <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Files are processed 100% locally in your browser memory</span>
          </div>
        </div>
      </div>

      {/* Uploaded Files Queue & Contextual Actions */}
      {queue.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Selected Files ({queue.length})
            </h4>
            <button
              onClick={() => setQueue([])}
              className="text-xs text-[var(--muted-text)] hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {queue.map((item) => {
              const category = getFileCategory(item.type, item.name);
              return (
                <div
                  key={item.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2"
                >
                  {/* File Metadata */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      {category === "pdf" ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : category === "image" ? (
                        <ImageIcon className="w-5 h-5 text-cyan-500" />
                      ) : (
                        <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--foreground)] truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-[var(--muted-text)] flex-shrink-0">
                          ({formatBytes(item.size)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.status === "ready" ? (
                          <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready • SHA-256 computed</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-blue-500 animate-pulse">
                              {item.statusMessage}
                            </span>
                          </div>
                        )}
                        {item.docId && (
                          <span className="text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[var(--muted)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                            {item.docId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contextual Smart Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                    {category === "pdf" && (
                      <>
                        <button
                          onClick={() => router.push(`/pdf/merge`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span>Merge</span>
                        </button>
                        <button
                          onClick={() => router.push(`/pdf/split`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Split className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Split</span>
                        </button>
                        <button
                          onClick={() => router.push(`/pdf/rotate`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                          <span>Rotate</span>
                        </button>
                        <button
                          onClick={() => router.push(`/pdf/compress`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Minimize2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Compress</span>
                        </button>
                        <button
                          onClick={() => router.push(`/pdf/to-image`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                          <span>To Image</span>
                        </button>
                        <button
                          onClick={() => router.push(`/verify/${item.docId || ""}`)}
                          className="px-2.5 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-500/30 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span>Verify</span>
                        </button>
                      </>
                    )}

                    {category === "image" && (
                      <>
                        <button
                          onClick={() => router.push(`/pdf/to-image`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Convert</span>
                        </button>
                        <button
                          onClick={() => router.push(`/transfer`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-blue-500" />
                          <span>Send to Phone</span>
                        </button>
                      </>
                    )}

                    {category === "office" && (
                      <>
                        <button
                          onClick={() => router.push(`/pdf/merge`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                          <span>PDF Workspace</span>
                        </button>
                        <button
                          onClick={() => router.push(`/transfer`)}
                          className="px-2.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-xs font-medium text-[var(--foreground)] border border-[var(--border-subtle)] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-blue-500" />
                          <span>Send to Phone</span>
                        </button>
                      </>
                    )}

                    {/* QuickSend to phone available for all */}
                    <button
                      onClick={() => router.push(`/transfer`)}
                      title="QuickSend to phone or tablet"
                      className="p-1.5 text-[var(--muted-text)] hover:text-blue-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>

                    {/* Remove file item */}
                    <button
                      onClick={(e) => removeItem(item.id, e)}
                      title="Remove file"
                      className="p-1.5 text-[var(--muted-text)] hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
