"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Copy, Check, QrCode, ExternalLink } from "lucide-react";

export default function QrScannerPage() {
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In standard browser environment, BarcodeDetector API is built-in in modern browsers
  const scanQrFromImage = async (imgElement: HTMLImageElement) => {
    setError(null);
    try {
      if ("BarcodeDetector" in window) {
        // @ts-expect-error - BarcodeDetector standard web API
        const detector = new window.BarcodeDetector({ formats: ["qr_code", "data_matrix"] });
        const barcodes = await detector.detect(imgElement);
        if (barcodes && barcodes.length > 0) {
          setDecodedText(barcodes[0].rawValue);
          return;
        }
      }
      // Fallback message if no barcode detected or not supported
      setDecodedText(null);
      setError("No standard QR code could be decoded from this image. Please ensure the QR code is sharp and well-lit.");
    } catch (e) {
      console.error(e);
      setError("Could not scan QR code: " + (e as Error).message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setError(null);
      setDecodedText(null);
      const url = URL.createObjectURL(f);
      setImagePreview(url);
      const img = new Image();
      img.onload = () => scanQrFromImage(img);
      img.src = url;
    }
  };

  const copy = () => {
    if (decodedText) {
      navigator.clipboard.writeText(decodedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUrl = decodedText?.startsWith("http://") || decodedText?.startsWith("https://");

  return (
    <ToolShell
      title="QR Code Scanner"
      description="Scan and decode QR codes from photos, screenshots, or local image files directly in your browser."
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
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <QrCode size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Click or drop a QR code image to decode</p>
            <p className="text-xs text-[var(--muted-text)] mt-1">Processed 100% locally on your machine</p>
          </div>
        </div>

        {/* Results */}
        {imagePreview && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <span className="text-sm font-semibold text-[var(--foreground)]">Decoded Content</span>
              {decodedText && (
                <div className="flex gap-2">
                  <button onClick={copy} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy Content"}
                  </button>
                  {isUrl && (
                    <a
                      href={decodedText}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} /> Open Link
                    </a>
                  )}
                </div>
              )}
            </div>

            {decodedText ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono text-sm text-emerald-400 break-all">
                {decodedText}
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                {error}
              </div>
            ) : (
              <div className="text-xs text-[var(--muted)] animate-pulse">Scanning QR code pixels...</div>
            )}

            <div className="max-h-60 overflow-hidden rounded-xl border border-[var(--border-subtle)] flex items-center justify-center p-3 bg-black/5 dark:bg-black/30">
              <img src={imagePreview} alt="Uploaded QR Code" className="max-h-52 object-contain rounded" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
