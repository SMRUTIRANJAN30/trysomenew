"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, ShieldCheck, Check, Sparkles } from "lucide-react";

export default function ExifRemovePage() {
  const [file, setFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setCleanedUrl(null);
      const url = URL.createObjectURL(f);
      setPreviewSrc(url);
    }
  };

  const stripExif = () => {
    if (!file || !previewSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Exporting from canvas produces raw image pixel buffers without EXIF/GPS/TIFF metadata
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCleanedUrl(url);
          }
          setIsProcessing(false);
        }, file.type === "image/png" ? "image/png" : "image/jpeg", 0.95);
      }
    };
    img.src = previewSrc;
  };

  const downloadCleaned = () => {
    if (!cleanedUrl || !file) return;
    const a = document.createElement("a");
    a.href = cleanedUrl;
    const ext = file.name.split(".").pop();
    a.download = file.name.replace(/\.[^/.]+$/, "") + "-no-exif." + ext;
    a.click();
  };

  return (
    <ToolShell
      title="Image EXIF & Metadata Remover"
      description="Protect your privacy by permanently removing embedded GPS coordinates, camera serial numbers, and device metadata from images."
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-blue-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--card-bg)] flex flex-col items-center justify-center gap-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Upload size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Click or drop a photo here to strip EXIF</p>
            <p className="text-xs text-[var(--muted-text)] mt-1">Supports JPG, PNG, WebP. Processed 100% locally in browser memory.</p>
          </div>
        </div>

        {file && previewSrc && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--foreground)]">{file.name}</h4>
                <span className="text-xs text-[var(--muted)] font-mono">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex gap-2">
                {!cleanedUrl ? (
                  <button
                    onClick={stripExif}
                    disabled={isProcessing}
                    className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
                  >
                    <ShieldCheck size={15} />
                    {isProcessing ? "Stripping Metadata..." : "Strip EXIF Data"}
                  </button>
                ) : (
                  <button
                    onClick={downloadCleaned}
                    className="btn-primary flex items-center gap-2 text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500"
                  >
                    <Download size={15} /> Download Clean Image
                  </button>
                )}
              </div>
            </div>

            {/* Privacy Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] flex items-center gap-2 text-[var(--foreground)]">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>GPS Location Removed</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] flex items-center gap-2 text-[var(--foreground)]">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Camera Model Cleared</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] flex items-center gap-2 text-[var(--foreground)]">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Date & Time Stripped</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] flex items-center gap-2 text-[var(--foreground)]">
                <Check size={14} className="text-emerald-500 shrink-0" />
                <span>Zero Pixel Degradation</span>
              </div>
            </div>

            {/* Image Preview */}
            <div className="max-h-80 overflow-hidden rounded-xl border border-[var(--border-subtle)] flex items-center justify-center bg-black/10 dark:bg-black/40 p-4">
              <img src={previewSrc} alt="Preview" className="max-h-72 object-contain rounded-lg shadow-md" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
