"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, Download, Sparkles } from "lucide-react";

export default function FaviconGeneratorPage() {
  const [text, setText] = useState("⚡");
  const [bgColor, setBgColor] = useState("#090e1a");
  const [textColor, setTextColor] = useState("#3b82f6");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setImageSrc(event.target.result);
        }
      };
      reader.readAsDataURL(f);
    }
  };

  const generateCanvas = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      ctx.drawImage(img, 0, 0, size, size);
    } else {
      // Draw background
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.25);
      ctx.fill();

      // Draw text / emoji
      ctx.fillStyle = textColor;
      ctx.font = `${Math.floor(size * 0.6)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2 + size * 0.05);
    }
    return canvas;
  };

  const downloadFavicon = (size: number) => {
    const canvas = generateCanvas(size);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `favicon-${size}x${size}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  return (
    <ToolShell
      title="Favicon Generator"
      description="Create multi-resolution browser favicons (16x16, 32x32, 180x180) from emoji, letters, or uploaded logos."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Emoji or Initial</label>
              <input
                value={text}
                maxLength={2}
                onChange={(e) => {
                  setText(e.target.value);
                  setImageSrc(null);
                }}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-lg text-[var(--foreground)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      setImageSrc(null);
                    }}
                    className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[var(--muted)] uppercase">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Foreground</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      setImageSrc(null);
                    }}
                    className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[var(--muted)] uppercase">{textColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-xs text-[var(--muted)] block mb-2">Or Upload Image:</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary w-full flex items-center justify-center gap-2 text-xs py-2.5"
              >
                <Upload size={14} /> Upload Custom Logo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* Favicon Previews & Downloads */}
          <div className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-[var(--foreground)] block mb-4">Live Browser Tab Mockup</span>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-black/10 dark:bg-black/40 p-3 max-w-sm flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center text-[10px] shadow-sm flex-shrink-0"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {text}
                </div>
                <span className="text-xs font-medium text-[var(--foreground)] truncate">My New Project — trysomenew</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-xs font-semibold text-[var(--foreground)] block">Export Formats:</span>
              <div className="grid grid-cols-3 gap-2">
                {[16, 32, 180].map((size) => (
                  <button
                    key={size}
                    onClick={() => downloadFavicon(size)}
                    className="btn-secondary flex items-center justify-center gap-1.5 text-xs py-2"
                  >
                    <Download size={13} /> {size}×{size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
