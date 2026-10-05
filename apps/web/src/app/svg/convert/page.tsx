"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, RefreshCw, FileImage, FileText } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SvgConvertPage() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [fileName, setFileName] = useState("vector");
  const [scale, setScale] = useState(2);
  const [isConverting, setIsConverting] = useState(false);
  const [previewPngUrl, setPreviewPngUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name.replace(/\.svg$/i, ""));
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setSvgContent(event.target.result);
          setPreviewPngUrl(null);
        }
      };
      reader.readAsText(f);
    }
  };

  const rasterizeToCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const w = (img.naturalWidth || 500) * scale;
        const h = (img.naturalHeight || 500) * scale;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
          resolve(canvas);
        } else {
          reject(new Error("Canvas context failed"));
        }
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  };

  const convertToPng = async () => {
    if (!svgContent) return;
    setIsConverting(true);
    try {
      const canvas = await rasterizeToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreviewPngUrl(url);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName}@${scale}x.png`;
          a.click();
        }
        setIsConverting(false);
      }, "image/png");
    } catch (e) {
      console.error(e);
      setIsConverting(false);
    }
  };

  const convertToPdf = async () => {
    if (!svgContent) return;
    setIsConverting(true);
    try {
      const canvas = await rasterizeToCanvas();
      const pngDataUrl = canvas.toDataURL("image/png");
      const pngBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.create();
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngImage.width,
        height: pngImage.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolShell
      title="SVG Converter (SVG to PNG / PDF)"
      description="Render crisp vector graphics into high-resolution PNG images or embed them directly into vector-dimensioned PDFs."
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-blue-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--card-bg)]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Upload size={22} />
            </div>
            {svgContent ? (
              <p className="text-sm font-semibold text-[var(--foreground)]">{fileName}.svg</p>
            ) : (
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Click or drag an SVG file here</p>
                <p className="text-xs text-[var(--muted-text)] mt-1">Processed locally on client canvas</p>
              </div>
            )}
          </div>
        </div>

        {/* Options & Action */}
        {svgContent && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Resolution Scale</label>
                <div className="flex gap-2">
                  {[1, 2, 4, 8].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                        scale === s ? "bg-blue-600 border-blue-500 text-white" : "border-[var(--border-subtle)] text-[var(--muted)]"
                      }`}
                    >
                      {s}x Scale
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={convertToPng}
                  disabled={isConverting}
                  className="btn-primary flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs py-2.5 px-5"
                >
                  <FileImage size={15} />
                  Export PNG
                </button>
                <button
                  onClick={convertToPdf}
                  disabled={isConverting}
                  className="btn-secondary flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs py-2.5 px-5"
                >
                  <FileText size={15} />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Live render preview */}
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--muted)] block mb-2">Vector Preview:</span>
              <div
                className="max-h-[220px] overflow-hidden rounded-xl bg-black/5 dark:bg-black/30 p-4 flex items-center justify-center [&>svg]:max-h-[180px]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
