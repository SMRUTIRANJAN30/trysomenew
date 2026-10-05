"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, Loader2, AlignCenter } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function PdfHeaderFooterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [headerText, setHeaderText] = useState("Confidential — trysomenew");
  const [footerText, setFooterText] = useState("Page {page} of {total}");
  const [headerAlign, setHeaderAlign] = useState<"left" | "center" | "right">("center");
  const [footerAlign, setFooterAlign] = useState<"left" | "center" | "right">("center");
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState("#4b5563");
  const [margin, setMargin] = useState(25);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r
      ? ([parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255] as const)
      : ([0.3, 0.3, 0.3] as const);
  };

  const apply = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const total = pages.length;
      const [r, g, b] = hexToRgb(color);

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const pageNum = (i + 1).toString();

        // Render Header if present
        if (headerText.trim()) {
          const hText = headerText
            .replace(/{page}/g, pageNum)
            .replace(/{total}/g, total.toString());
          const hWidth = font.widthOfTextAtSize(hText, fontSize);
          let hX = margin;
          if (headerAlign === "center") hX = width / 2 - hWidth / 2;
          else if (headerAlign === "right") hX = width - margin - hWidth;
          const hY = height - margin;
          page.drawText(hText, { x: hX, y: hY, size: fontSize, font, color: rgb(r, g, b) });
        }

        // Render Footer if present
        if (footerText.trim()) {
          const fText = footerText
            .replace(/{page}/g, pageNum)
            .replace(/{total}/g, total.toString());
          const fWidth = font.widthOfTextAtSize(fText, fontSize);
          let fX = margin;
          if (footerAlign === "center") fX = width / 2 - fWidth / 2;
          else if (footerAlign === "right") fX = width - margin - fWidth;
          const fY = margin;
          page.drawText(fText, { x: fX, y: fY, size: fontSize, font, color: rgb(r, g, b) });
        }
      });

      const out = await pdfDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.pdf$/i, "") + "-header-footer.pdf";
    a.click();
  };

  return (
    <ToolShell
      title="PDF Header & Footer"
      description="Add custom header and footer text to every page of your PDF directly in your browser."
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-blue-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--card-bg)]"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setResultUrl(null);
              }
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Upload size={22} />
            </div>
            {file ? (
              <p className="text-sm font-semibold text-[var(--foreground)]">{file.name}</p>
            ) : (
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Click or drop a PDF here</p>
                <p className="text-xs text-[var(--muted-text)] mt-1">Processed 100% locally in your browser memory</p>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        {file && (
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Header Text (use {'{page}'}, {'{total}'})</label>
                <input
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
                  placeholder="Header text..."
                />
                <div className="flex gap-2 mt-2">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setHeaderAlign(a)}
                      className={`px-3 py-1 text-xs rounded-lg border capitalize ${
                        headerAlign === a ? "bg-blue-600 border-blue-500 text-white" : "border-[var(--border-subtle)] text-[var(--muted)]"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Footer Text (use {'{page}'}, {'{total}'})</label>
                <input
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
                  placeholder="Footer text..."
                />
                <div className="flex gap-2 mt-2">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setFooterAlign(a)}
                      className={`px-3 py-1 text-xs rounded-lg border capitalize ${
                        footerAlign === a ? "bg-blue-600 border-blue-500 text-white" : "border-[var(--border-subtle)] text-[var(--muted)]"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[var(--border-subtle)]">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min={8}
                  max={24}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Margin: {margin}px</label>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[var(--muted)]">{color}</span>
                </div>
              </div>
            </div>

            <button
              onClick={apply}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <AlignCenter size={16} />}
              {loading ? "Processing PDF..." : "Apply Header & Footer"}
            </button>
          </div>
        )}

        {/* Download result */}
        {resultUrl && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-400">PDF successfully updated!</span>
            <button onClick={download} className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
              <Download size={14} /> Download PDF
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
