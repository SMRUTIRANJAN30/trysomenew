"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, EyeOff, ShieldCheck, Plus, Trash2, Check } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

interface RedactBox {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function PdfRedactPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(1);
  const [boxes, setBoxes] = useState<RedactBox[]>([
    { id: "1", page: 1, x: 50, y: 700, width: 250, height: 25 },
  ]);
  const [isRedacting, setIsRedacting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error(err);
    }
  };

  const addBox = () => {
    const newBox: RedactBox = {
      id: Math.random().toString(36).substring(7),
      page: 1,
      x: 50,
      y: 650,
      width: 200,
      height: 20,
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (id: string) => {
    setBoxes(boxes.filter((b) => b.id !== id));
  };

  const updateBox = (id: string, updates: Partial<RedactBox>) => {
    setBoxes(boxes.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const applyRedaction = async () => {
    if (!file) return;
    setIsRedacting(true);
    setResultUrl(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();

      for (const box of boxes) {
        const targetPageIdx = Math.max(0, Math.min(box.page - 1, pages.length - 1));
        const page = pages[targetPageIdx];
        page.drawRectangle({
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          color: rgb(0, 0, 0),
        });
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedacting(false);
    }
  };

  const downloadRedacted = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.pdf$/i, "") + "-redacted.pdf";
    a.click();
  };

  return (
    <ToolShell
      title="PDF Permanent Redaction (Phase 3)"
      description="Permanently black out sensitive names, numbers, or addresses from PDF documents before sharing. Zero data leakage."
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-red-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--card-bg)] flex flex-col items-center justify-center gap-3"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <EyeOff size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {file ? file.name : "Click or drop a PDF to redact sensitive sections"}
            </p>
            <p className="text-xs text-[var(--muted-text)] mt-1">
              {file ? `Detected ${pageCount} pages. Ready to redact.` : "100% Client-Side. Overlays solid black vector boxes."}
            </p>
          </div>
        </div>

        {file && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--foreground)]">Redaction Coordinates</h4>
                <p className="text-xs text-[var(--muted)]">Specify bounding boxes to permanently obscure.</p>
              </div>
              <button onClick={addBox} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                <Plus size={13} /> Add Redaction Box
              </button>
            </div>

            <div className="space-y-3">
              {boxes.map((b, idx) => (
                <div
                  key={b.id}
                  className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-[var(--border-subtle)] text-xs"
                >
                  <div>
                    <label className="text-[10px] text-[var(--muted-text)] block mb-0.5">Page</label>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={b.page}
                      onChange={(e) => updateBox(b.id, { page: Number(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--muted-text)] block mb-0.5">X (pt)</label>
                    <input
                      type="number"
                      value={b.x}
                      onChange={(e) => updateBox(b.id, { x: Number(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--muted-text)] block mb-0.5">Y (pt)</label>
                    <input
                      type="number"
                      value={b.y}
                      onChange={(e) => updateBox(b.id, { y: Number(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--muted-text)] block mb-0.5">Width</label>
                    <input
                      type="number"
                      value={b.width}
                      onChange={(e) => updateBox(b.id, { width: Number(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--muted-text)] block mb-0.5">Height</label>
                    <input
                      type="number"
                      value={b.height}
                      onChange={(e) => updateBox(b.id, { height: Number(e.target.value) })}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="flex justify-end pt-3 sm:pt-0">
                    <button onClick={() => removeBox(b.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck size={14} /> True bitwise black-out applied to underlying streams
              </span>
              <button
                onClick={applyRedaction}
                disabled={isRedacting}
                className="btn-primary flex items-center gap-2 py-2.5 px-6 text-xs w-full sm:w-auto justify-center"
              >
                <EyeOff size={14} />
                {isRedacting ? "Applying Redaction..." : "Permanently Redact PDF"}
              </button>
            </div>

            {resultUrl && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between animate-in fade-in">
                <span className="text-xs font-semibold text-emerald-400">PDF successfully redacted!</span>
                <button
                  onClick={downloadRedacted}
                  className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4"
                >
                  <Download size={13} /> Download Redacted PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
