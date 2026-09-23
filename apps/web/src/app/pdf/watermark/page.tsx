"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, Loader2 } from "lucide-react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

type WatermarkMode = "text" | "diagonal" | "stamp";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [mode, setMode] = useState<WatermarkMode>("diagonal");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ff0000");
  const [onlyFirstPage, setOnlyFirstPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255] as const : [1, 0, 0] as const;
  };

  const apply = async () => {
    if (!file) return;
    setLoading(true);
    setResultUrl(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = onlyFirstPage ? [pdfDoc.getPage(0)] : pdfDoc.getPages();
      const [r, g, b] = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        if (mode === "diagonal") {
          page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: height / 2,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity / 100,
            rotate: degrees(45),
          });
        } else if (mode === "stamp") {
          // Draw border + text centered
          const cx = width / 2 - textWidth / 2;
          const cy = height / 2 - fontSize / 2;
          page.drawRectangle({
            x: cx - 20,
            y: cy - 10,
            width: textWidth + 40,
            height: fontSize + 20,
            borderColor: rgb(r, g, b),
            borderWidth: 3,
            opacity: opacity / 100,
          });
          page.drawText(text, { x: cx, y: cy + 5, size: fontSize, font, color: rgb(r, g, b), opacity: opacity / 100 });
        } else {
          // Horizontal text center
          page.drawText(text, {
            x: width / 2 - textWidth / 2,
            y: height - fontSize - 20,
            size: fontSize,
            font,
            color: rgb(r, g, b),
            opacity: opacity / 100,
          });
        }
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(".pdf", "-watermarked.pdf");
    a.click();
  };

  return (
    <ToolShell title="PDF Watermark" description="Add text watermarks to PDF — diagonal, horizontal, or stamp style. Runs entirely in your browser.">
      <div className="space-y-5">
        {!file ? (
          <div onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500/50 transition-colors">
            <Upload size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">Drop a PDF or click to select</p>
            <input ref={inputRef} type="file" accept=".pdf" className="hidden"
              onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{file.name}</p>
              <button onClick={() => { setFile(null); setResultUrl(null); }} className="text-xs text-gray-500 hover:text-red-400 transition-colors">✕ Remove</button>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Watermark Text</label>
              <input value={text} onChange={e => setText(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>

            <div className="flex gap-2">
              {(["diagonal", "text", "stamp"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 px-3 py-2 capitalize text-sm rounded-xl border transition-colors ${mode === m ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300"}`}
                >{m === "diagonal" ? "🔄 Diagonal" : m === "stamp" ? "🔲 Stamp Box" : "⬆️ Header"}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Opacity: {opacity}%</label>
                <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Font Size: {fontSize}pt</label>
                <input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Color</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/10 cursor-pointer p-0.5 bg-transparent" />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-5 text-sm text-gray-300">
                  <input type="checkbox" checked={onlyFirstPage} onChange={e => setOnlyFirstPage(e.target.checked)} className="accent-blue-500" />
                  First page only
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={apply} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={14} className="animate-spin" />Applying...</> : "Apply Watermark"}
              </button>
              {resultUrl && (
                <button onClick={download} className="btn-secondary flex items-center gap-2">
                  <Download size={14} />Download PDF
                </button>
              )}
            </div>

            {resultUrl && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                ✅ Watermark applied! Click Download to save your PDF.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
