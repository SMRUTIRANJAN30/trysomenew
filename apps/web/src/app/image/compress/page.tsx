"use client";
import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, Trash2, RefreshCw, SunMoon } from "lucide-react";

type Tab = "compress" | "resize" | "convert" | "crop" | "watermark" | "grayscale" | "clean_bg";

const FORMAT_MIME: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/bmp": "bmp",
};

async function processImage(
  file: File,
  tab: Tab,
  opts: {
    quality: number;
    width: number;
    height: number;
    lockAspect: boolean;
    outputFormat: string;
    watermarkText: string;
    watermarkOpacity: number;
    cleanBgMode?: "clean_white" | "scan_bw" | "invert";
    bwThreshold?: number;
  }
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let tw = img.width, th = img.height;

      if (tab === "resize") {
        tw = opts.width || img.width;
        if (opts.lockAspect) th = Math.round(tw * img.height / img.width);
        else th = opts.height || img.height;
      }

      if (tab === "crop") {
        tw = Math.min(opts.width || img.width, img.width);
        th = Math.min(opts.height || img.height, img.height);
      }

      const canvas = document.createElement("canvas");
      canvas.width = tw; canvas.height = th;
      const ctx = canvas.getContext("2d")!;

      if (tab === "grayscale") {
        ctx.filter = "grayscale(100%)";
      }

      ctx.drawImage(img, 0, 0, tw, th);
      ctx.filter = "none";

      if (tab === "clean_bg") {
        const imgData = ctx.getImageData(0, 0, tw, th);
        const data = imgData.data;
        const mode = opts.cleanBgMode || "clean_white";
        const threshold = opts.bwThreshold || 140;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          if (mode === "clean_white") {
            // Dark backgrounds converted to crisp white; preserve dark text
            if (gray < 85) {
              data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            } else if (gray > 200) {
              data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            } else {
              const darkened = Math.max(0, gray - 50);
              data[i] = darkened; data[i + 1] = darkened; data[i + 2] = darkened;
            }
          } else if (mode === "scan_bw") {
            const val = gray > threshold ? 255 : 0;
            data[i] = val; data[i + 1] = val; data[i + 2] = val;
          } else if (mode === "invert") {
            data[i] = 255 - r; data[i + 1] = 255 - g; data[i + 2] = 255 - b;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      if (tab === "watermark" && opts.watermarkText) {
        ctx.globalAlpha = opts.watermarkOpacity / 100;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(20, Math.round(tw / 15))}px sans-serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 8;
        ctx.fillText(opts.watermarkText, tw / 2, th / 2);
        ctx.globalAlpha = 1;
      }

      const mime = tab === "convert" ? opts.outputFormat : (tab === "clean_bg" ? "image/png" : file.type);
      const quality = (tab === "compress" || mime === "image/jpeg" || mime === "image/webp") ? opts.quality / 100 : undefined;

      canvas.toBlob(blob => {
        URL.revokeObjectURL(url);
        if (blob) resolve({ blob, width: tw, height: th });
        else reject(new Error("Canvas toBlob failed"));
      }, mime, quality);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

export default function ImageToolsPage() {
  const [tab, setTab] = useState<Tab>("compress");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quality, setQuality] = useState(80);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState("image/jpeg");
  const [watermarkText, setWatermarkText] = useState("© trysomenew");
  const [watermarkOpacity, setWatermarkOpacity] = useState(70);
  const [cleanBgMode, setCleanBgMode] = useState<"clean_white" | "scan_bw" | "invert">("clean_white");
  const [bwThreshold, setBwThreshold] = useState(140);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setResult(null); setError("");
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setWidth(img.width); setHeight(img.height); };
    img.src = url;
  };

  const process = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const out = await processImage(file, tab, {
        quality,
        width,
        height,
        lockAspect,
        outputFormat,
        watermarkText,
        watermarkOpacity,
        cleanBgMode,
        bwThreshold,
      });
      const url = URL.createObjectURL(out.blob);
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ url, size: out.blob.size, width: out.width, height: out.height });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const ext = FORMAT_MIME[tab === "convert" ? outputFormat : file.type] || "jpg";
    const a = document.createElement("a"); a.href = result.url;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}-${tab}.${ext}`; a.click();
  };

  const formatBytes = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;
  const reduction = file && result ? Math.round((1 - result.size / file.size) * 100) : 0;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "compress", label: "Compress", icon: "🗜️" },
    { id: "resize", label: "Resize", icon: "↔️" },
    { id: "convert", label: "Convert", icon: "🔄" },
    { id: "crop", label: "Crop", icon: "✂️" },
    { id: "clean_bg", label: "B&W / Clean BG", icon: "🌓" },
    { id: "grayscale", label: "Grayscale", icon: "⬛" },
    { id: "watermark", label: "Watermark", icon: "💧" },
  ];

  return (
    <ToolShell title="Image Tools" description="Compress, resize, convert, crop, watermark, clean dark backgrounds to white, and convert images to B&W — all in your browser.">
      <div className="space-y-5">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setResult(null); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap border transition-colors ${tab === t.id ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Upload */}
        {!file ? (
          <div
            className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">Drop an image or click to select</p>
            <p className="text-xs text-gray-600 mt-1">JPG, PNG, WebP, GIF, BMP, SVG</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Options */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)} · {file.type}</p>
                </div>
                <button onClick={() => { setFile(null); setPreview(null); setResult(null); }} className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Tab-specific options */}
              {tab === "compress" && (
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-gray-400">Quality</label>
                    <span className="text-sm font-bold text-white">{quality}%</span>
                  </div>
                  <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              )}

              {(tab === "resize" || tab === "crop") && (
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">Width (px)</label>
                      <input type="number" value={width} onChange={e => {
                        const w = Number(e.target.value);
                        setWidth(w);
                        if (lockAspect && file) {
                          const img = new Image();
                          img.onload = () => setHeight(Math.round(w * img.height / img.width));
                          img.src = URL.createObjectURL(file);
                        }
                      }} className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">Height (px)</label>
                      <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none" />
                    </div>
                  </div>
                  {tab === "resize" && (
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                      <input type="checkbox" checked={lockAspect} onChange={e => setLockAspect(e.target.checked)} className="accent-blue-500" />
                      Lock aspect ratio
                    </label>
                  )}
                </div>
              )}

              {tab === "convert" && (
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Output Format</label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(FORMAT_MIME).map(([mime, ext]) => (
                      <button key={mime} onClick={() => setOutputFormat(mime)}
                        className={`px-3 py-1.5 text-sm rounded-lg border uppercase transition-colors ${outputFormat === mime ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
                      >{ext}</button>
                    ))}
                  </div>
                  {(outputFormat === "image/jpeg" || outputFormat === "image/webp") && (
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-gray-400">Quality</label>
                        <span className="text-sm font-bold text-white">{quality}%</span>
                      </div>
                      <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-blue-500" />
                    </div>
                  )}
                </div>
              )}

              {tab === "clean_bg" && (
                <div className="space-y-3">
                  <label className="text-xs text-gray-400 block mb-1">Background & B&W Conversion Mode</label>
                  <div className="space-y-2">
                    {[
                      { id: "clean_white", label: "Clean White BG", desc: "Convert dark/black background to crisp white (keeps dark text)" },
                      { id: "scan_bw", label: "Document Scan B&W", desc: "Pure high-contrast black and white threshold" },
                      { id: "invert", label: "Invert Colors", desc: "Negative to positive color inversion" },
                    ].map(opt => (
                      <label key={opt.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${cleanBgMode === opt.id ? "bg-blue-500/10 border-blue-500 text-white" : "bg-white/[0.02] border-white/10 text-gray-400 hover:border-white/20"}`}>
                        <input
                          type="radio"
                          name="cleanBgMode"
                          checked={cleanBgMode === opt.id}
                          onChange={() => setCleanBgMode(opt.id as any)}
                          className="accent-blue-500 mt-1"
                        />
                        <div>
                          <p className="text-xs font-semibold">{opt.label}</p>
                          <p className="text-[11px] text-gray-500">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {cleanBgMode === "scan_bw" && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Threshold: {bwThreshold}</span>
                        <span>(Higher = darker text)</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={220}
                        value={bwThreshold}
                        onChange={e => setBwThreshold(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {tab === "watermark" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Watermark Text</label>
                    <input value={watermarkText} onChange={e => setWatermarkText(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-gray-400">Opacity</label>
                      <span className="text-sm text-white">{watermarkOpacity}%</span>
                    </div>
                    <input type="range" min={10} max={100} value={watermarkOpacity} onChange={e => setWatermarkOpacity(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                </div>
              )}

              {tab === "grayscale" && (
                <p className="text-sm text-gray-500">Converts image to black and white using 256-level grayscale.</p>
              )}

              <button onClick={process} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><RefreshCw size={14} className="animate-spin" />Processing...</> : "Process Image"}
              </button>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
            </div>

            {/* Preview */}
            <div className="flex flex-col gap-3">
              {preview && (
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Original</label>
                  <img src={preview} alt="Original" className="w-full rounded-xl border border-white/10 object-contain max-h-48" />
                </div>
              )}
              {result && (
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Result</label>
                  <img src={result.url} alt="Result" className="w-full rounded-xl border border-white/10 object-contain max-h-48" />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {result.width}×{result.height}px · {formatBytes(result.size)}
                      {tab === "compress" && reduction > 0 && (
                        <span className="text-emerald-400 ml-2">({reduction}% smaller)</span>
                      )}
                    </div>
                    <button onClick={download} className="btn-primary text-xs py-1.5 flex items-center gap-1.5">
                      <Download size={12} />Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
