"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, Loader2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
type Format = "numeric" | "of-total" | "roman";

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("numeric");
  const [startNum, setStartNum] = useState(1);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [fontSize, setFontSize] = useState(11);
  const [color, setColor] = useState("#333333");
  const [margin, setMargin] = useState(20);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255] as const : [0.2, 0.2, 0.2] as const;
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
        const pageNum = startNum + i;
        let numText: string;
        if (format === "roman") numText = toRoman(pageNum).toLowerCase();
        else if (format === "of-total") numText = `${pageNum} of ${startNum + total - 1}`;
        else numText = pageNum.toString();
        const label = `${prefix}${numText}${suffix}`;
        const tw = font.widthOfTextAtSize(label, fontSize);

        let x: number, y: number;
        const isBottom = position.startsWith("bottom");
        y = isBottom ? margin : height - margin - fontSize;
        if (position.includes("left")) x = margin;
        else if (position.includes("right")) x = width - tw - margin;
        else x = width / 2 - tw / 2;

        page.drawText(label, { x, y, size: fontSize, font, color: rgb(r, g, b) });
      });

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
    a.download = file.name.replace(".pdf", "-numbered.pdf");
    a.click();
  };

  const POSITIONS: { id: Position; label: string }[] = [
    { id: "top-left", label: "Top Left" },
    { id: "top-center", label: "Top Center" },
    { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" },
    { id: "bottom-center", label: "Bottom Center" },
    { id: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <ToolShell title="PDF Page Numbers" description="Add custom page numbers to any PDF — choose position, format, prefix, and starting number.">
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

            {/* Position grid */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">Number Position</label>
              <div className="grid grid-cols-3 gap-2">
                {POSITIONS.map(p => (
                  <button key={p.id} onClick={() => setPosition(p.id)}
                    className={`py-2 text-xs rounded-xl border transition-colors ${position === p.id ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
                  >{p.label}</button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">Number Format</label>
              <div className="flex gap-2">
                {(["numeric", "of-total", "roman"] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${format === f ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300"}`}
                  >{f === "numeric" ? "1, 2, 3..." : f === "of-total" ? "1 of 10..." : "i, ii, iii..."}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Prefix (optional)</label>
                <input value={prefix} onChange={e => setPrefix(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none"
                  placeholder="Page " />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Suffix (optional)</label>
                <input value={suffix} onChange={e => setSuffix(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Start number</label>
                <input type="number" min={1} value={startNum} onChange={e => setStartNum(Number(e.target.value))}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Font size: {fontSize}pt</label>
                <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full mt-2 accent-blue-500" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-xs text-gray-500 flex items-center gap-2">
                Color: <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-white/10 p-0.5" />
              </label>
              <label className="text-xs text-gray-500 flex items-center gap-2">
                Margin: {margin}px
                <input type="range" min={5} max={60} value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-20 accent-blue-500" />
              </label>
            </div>

            <div className="glass rounded-xl p-3 text-xs text-gray-500 font-mono">
              Preview: <span className="text-gray-300">{prefix}{startNum}{suffix}</span> → <span className="text-gray-300">{prefix}{startNum + 1}{suffix}</span> → <span className="text-gray-300">{prefix}{startNum + 2}{suffix}...</span>
            </div>

            <div className="flex gap-2">
              <button onClick={apply} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={14} className="animate-spin" />Adding...</> : "Add Page Numbers"}
              </button>
              {resultUrl && (
                <button onClick={download} className="btn-secondary flex items-center gap-2">
                  <Download size={14} />Download PDF
                </button>
              )}
            </div>

            {resultUrl && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
                ✅ Page numbers added! Click Download to save.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
