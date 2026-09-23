"use client";
import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download } from "lucide-react";
import JsBarcode from "jsbarcode";

const FORMATS = [
  { id: "CODE128", label: "Code 128", example: "Hello World 123" },
  { id: "CODE39", label: "Code 39", example: "ABC-1234" },
  { id: "EAN13", label: "EAN-13", example: "5901234123457" },
  { id: "EAN8", label: "EAN-8", example: "96385074" },
  { id: "UPC", label: "UPC-A", example: "012345678905" },
  { id: "ITF14", label: "ITF-14", example: "00012345678905" },
  { id: "MSI", label: "MSI", example: "1234567" },
  { id: "pharmacode", label: "Pharmacode", example: "1234" },
];

export default function BarcodeGeneratorPage() {
  const [format, setFormat] = useState("CODE128");
  const [value, setValue] = useState("Hello World 123");
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [displayValue, setDisplayValue] = useState(true);
  const [error, setError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value.trim()) return;
    try {
      JsBarcode(svgRef.current, value, {
        format,
        lineColor,
        background,
        width,
        height,
        displayValue,
        margin: 10,
      });
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message || "Invalid value for this barcode format");
    }
  }, [format, value, lineColor, background, width, height, displayValue]);

  const download = (type: "svg" | "png") => {
    if (!svgRef.current) return;
    if (type === "svg") {
      const data = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([data], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `barcode-${format}.svg`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * 2; canvas.height = img.height * 2;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = `barcode-${format}.png`; a.click();
          URL.revokeObjectURL(url);
        }, "image/png");
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <ToolShell title="Barcode Generator" description="Generate Code128, Code39, EAN-13, EAN-8, UPC-A, ITF-14 barcodes. Download as SVG or PNG.">
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FORMATS.map(f => (
            <button key={f.id} onClick={() => { setFormat(f.id); setValue(f.example); }}
              className={`px-3 py-2 text-sm rounded-xl border text-left transition-colors ${format === f.id ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              <div className="font-medium">{f.label}</div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">{f.example}</div>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Barcode Value</label>
            <input value={value} onChange={e => setValue(e.target.value)}
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              Bar color: <input type="color" value={lineColor} onChange={e => setLineColor(e.target.value)}
                className="w-8 h-8 rounded border border-white/10 cursor-pointer" />
            </label>
            <label className="text-sm text-gray-400 flex items-center gap-2">
              Background: <input type="color" value={background} onChange={e => setBackground(e.target.value)}
                className="w-8 h-8 rounded border border-white/10 cursor-pointer" />
            </label>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bar width</label>
              <input type="range" min={1} max={5} value={width} onChange={e => setWidth(Number(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Height: {height}px</label>
              <input type="range" min={30} max={200} value={height} onChange={e => setHeight(Number(e.target.value))}
                className="w-full accent-blue-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input type="checkbox" checked={displayValue} onChange={e => setDisplayValue(e.target.checked)} className="accent-blue-500" />
            Show text below barcode
          </label>
        </div>

        {error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 rounded-2xl border border-white/10" style={{ background }}>
              <svg ref={svgRef} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => download("png")} className="btn-primary flex items-center gap-2">
                <Download size={14} />Download PNG
              </button>
              <button onClick={() => download("svg")} className="btn-secondary flex items-center gap-2">
                <Download size={14} />Download SVG
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
