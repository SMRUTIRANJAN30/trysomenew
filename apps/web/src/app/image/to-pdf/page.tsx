"use client";

import React, { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { DraggableList } from "@/components/tools/DraggableList";
import {
  UploadCloud,
  FileImage,
  Download,
  Settings,
  Sliders,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  Maximize,
  SunMoon,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import confetti from "canvas-confetti";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { A4_PORTRAIT, A4_LANDSCAPE } from "@/lib/pdf/a4";

interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
}

type PageSizeOption = "a4" | "letter" | "fit_image";
type OrientationOption = "auto" | "portrait" | "landscape";
type ColorFilterOption = "original" | "clean_white_bg" | "scan_bw" | "grayscale" | "invert";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>("a4");
  const [orientation, setOrientation] = useState<OrientationOption>("auto");
  const [margin, setMargin] = useState<number>(20);
  const [colorFilter, setColorFilter] = useState<ColorFilterOption>("original");
  const [bwThreshold, setBwThreshold] = useState<number>(140);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const newItems: ImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/") && !file.name.match(/\.(png|jpe?g|webp|gif|bmp|svg)$/i)) {
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            name: file.name,
            size: file.size,
            previewUrl,
            width: img.width,
            height: img.height,
          });
          resolve();
        };
        img.onerror = () => resolve();
        img.src = previewUrl;
      });
    }

    if (newItems.length === 0) {
      setError("Please select valid image files (PNG, JPG, WebP, GIF, BMP, SVG).");
      return;
    }

    setImages((prev) => [...prev, ...newItems]);
    setGeneratedPdfBlob(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setGeneratedPdfBlob(null);
  };

  /**
   * Applies client-side canvas filters (Clean White Background, Scan B&W threshold, Grayscale, Invert)
   */
  const processImageToBytes = async (
    item: ImageItem,
    filter: ColorFilterOption,
    threshold: number
  ): Promise<{ bytes: Uint8Array; width: number; height: number; format: "jpg" | "png" }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original
        ctx.drawImage(img, 0, 0);

        if (filter !== "original") {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;

            if (filter === "grayscale") {
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            } else if (filter === "clean_white_bg") {
              // Convert dark/black backgrounds to white; keep text crisp
              if (gray < 80) {
                // If it's a dark background pixel, invert to bright white
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
              } else if (gray > 200) {
                // Bright white stays bright white
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
              } else {
                // Intermediate text or lines: darken for contrast
                const highContrast = Math.max(0, gray - 50);
                data[i] = highContrast;
                data[i + 1] = highContrast;
                data[i + 2] = highContrast;
              }
            } else if (filter === "scan_bw") {
              // Document Scan Threshold: pure black or pure white
              const val = gray > threshold ? 255 : 0;
              data[i] = val;
              data[i + 1] = val;
              data[i + 2] = val;
            } else if (filter === "invert") {
              data[i] = 255 - r;
              data[i + 1] = 255 - g;
              data[i + 2] = 255 - b;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // Export as JPEG (or PNG if original has transparency and no filter)
        const format: "jpg" | "png" = filter === "original" && item.file.type === "image/png" ? "png" : "jpg";
        const mime = format === "png" ? "image/png" : "image/jpeg";

        canvas.toBlob(
          async (blob) => {
            if (!blob) return reject(new Error("Canvas blob export failed"));
            const arrayBuf = await blob.arrayBuffer();
            resolve({
              bytes: new Uint8Array(arrayBuf),
              width: canvas.width,
              height: canvas.height,
              format,
            });
          },
          mime,
          0.92
        );
      };
      img.onerror = () => reject(new Error(`Failed to load ${item.name}`));
      img.src = item.previewUrl;
    });
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) {
      setError("Please add at least one image.");
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setStatusMessage("Creating new PDF document...");
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const total = images.length;

      for (let i = 0; i < total; i++) {
        const item = images[i];
        setStatusMessage(`Processing image ${i + 1} of ${total}: ${item.name}...`);
        setProgress(Math.round(10 + (i / total) * 75));

        const processed = await processImageToBytes(item, colorFilter, bwThreshold);

        // Embed in PDF
        const embeddedImage =
          processed.format === "png"
            ? await pdfDoc.embedPng(processed.bytes)
            : await pdfDoc.embedJpg(processed.bytes);

        // Determine Page Size
        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "a4") {
          if (orientation === "portrait") {
            pageWidth = A4_PORTRAIT[0];
            pageHeight = A4_PORTRAIT[1];
          } else if (orientation === "landscape") {
            pageWidth = A4_LANDSCAPE[0];
            pageHeight = A4_LANDSCAPE[1];
          } else {
            // Auto orientation per image
            if (processed.width > processed.height) {
              pageWidth = A4_LANDSCAPE[0];
              pageHeight = A4_LANDSCAPE[1];
            } else {
              pageWidth = A4_PORTRAIT[0];
              pageHeight = A4_PORTRAIT[1];
            }
          }
        } else if (pageSize === "letter") {
          // US Letter: 612 x 792 pt
          if (orientation === "landscape" || (orientation === "auto" && processed.width > processed.height)) {
            pageWidth = 792;
            pageHeight = 612;
          } else {
            pageWidth = 612;
            pageHeight = 792;
          }
        } else {
          // Fit Image size directly
          pageWidth = processed.width;
          pageHeight = processed.height;
        }

        const usableW = Math.max(20, pageWidth - margin * 2);
        const usableH = Math.max(20, pageHeight - margin * 2);

        // Calculate aspect fit
        const scaleX = usableW / processed.width;
        const scaleY = usableH / processed.height;
        const scale = Math.min(scaleX, scaleY, pageSize === "fit_image" ? 1 : Infinity);

        const drawW = processed.width * scale;
        const drawH = processed.height * scale;

        const xPos = margin + (usableW - drawW) / 2;
        const yPos = margin + (usableH - drawH) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x: xPos,
          y: yPos,
          width: drawW,
          height: drawH,
        });
      }

      setProgress(90);
      setStatusMessage("Finalizing and saving PDF...");
      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setGeneratedPdfBlob(blob);
      setProgress(100);
      setStatusMessage("Done!");

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setError(err?.message || "Failed to generate PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPdfBlob) return;
    const baseName = images[0]?.name.replace(/\.[^/.]+$/, "") || "converted_images";
    downloadBlob(generatedPdfBlob, `${baseName}_trysomenew.pdf`);
  };

  return (
    <ToolShell
      title="Images to PDF Converter"
      description="Convert PNG, JPG, WebP, GIF, BMP, and SVG images to standard A4 PDF. Reorder pages up/down, convert black-to-white backgrounds, and adjust margins."
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/[0.02] cursor-pointer transition-all text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-3">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-base font-semibold text-gray-200">
            Click or drag & drop images here
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Supports PNG, JPG, JPEG, WebP, GIF, BMP, SVG · Multiple files supported
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Configuration Toolbar */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Settings size={18} className="text-blue-400" />
            <h4 className="text-sm font-semibold text-gray-200">PDF & Color Options</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Page Size & A4 */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                📄 Page Format (A4 Option)
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="a4" className="bg-[#121620]">Standard A4 (595 × 842 pt)</option>
                <option value="letter" className="bg-[#121620]">US Letter (612 × 792 pt)</option>
                <option value="fit_image" className="bg-[#121620]">Fit Image Dimensions</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                🧭 Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as OrientationOption)}
                disabled={pageSize === "fit_image"}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-40"
              >
                <option value="auto" className="bg-[#121620]">Auto (per image)</option>
                <option value="portrait" className="bg-[#121620]">Portrait</option>
                <option value="landscape" className="bg-[#121620]">Landscape</option>
              </select>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                📐 Margins: {margin} pt
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value={0} className="bg-[#121620]">No Margins (0 pt)</option>
                <option value={14} className="bg-[#121620]">Compact (14 pt)</option>
                <option value={20} className="bg-[#121620]">Standard A4 (20 pt)</option>
                <option value={40} className="bg-[#121620]">Large Margins (40 pt)</option>
              </select>
            </div>
          </div>

          {/* Color Conversion & Black to White Background */}
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <SunMoon size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-gray-300">
                🎨 Black-to-White / Background Cleaning Options:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                { id: "original", label: "Original Color", desc: "Keep original colors" },
                { id: "clean_white_bg", label: "Clean White BG", desc: "Convert dark backgrounds to white" },
                { id: "scan_bw", label: "Document Scan B&W", desc: "High contrast pure B&W" },
                { id: "grayscale", label: "Grayscale", desc: "256-level smooth mono" },
                { id: "invert", label: "Invert Colors", desc: "Negative to positive" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColorFilter(opt.id as ColorFilterOption)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    colorFilter === opt.id
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-md shadow-blue-500/10"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-gray-200"
                  }`}
                >
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{opt.desc}</p>
                </button>
              ))}
            </div>

            {colorFilter === "scan_bw" && (
              <div className="mt-3 p-3 bg-white/[0.02] border border-white/10 rounded-xl flex items-center gap-4">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  B&W Threshold: <strong className="text-white">{bwThreshold}</strong>
                </span>
                <input
                  type="range"
                  min={50}
                  max={220}
                  value={bwThreshold}
                  onChange={(e) => setBwThreshold(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  (Lower = more white, Higher = bolder text)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Image List with Drag and Drop Reordering */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <span>Images to Convert ({images.length})</span>
                <span className="text-[11px] font-normal text-gray-500">
                  Drag items or use ↑/↓ arrows to reorder pages
                </span>
              </h4>
              <button
                type="button"
                onClick={() => setImages([])}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            <DraggableList
              items={images}
              onReorder={setImages}
              onRemove={removeImage}
              renderItem={(img) => (
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={img.previewUrl}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{img.name}</p>
                    <p className="text-xs text-gray-500">
                      {img.width} × {img.height} px · {formatBytes(img.size)}
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <div className="glass rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={images.length === 0 || isProcessing}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating A4 PDF...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate A4 PDF ({images.length} {images.length === 1 ? "page" : "pages"})
              </>
            )}
          </button>

          {generatedPdfBlob && (
            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Download size={16} />
              Download PDF ({formatBytes(generatedPdfBlob.size)})
            </button>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
