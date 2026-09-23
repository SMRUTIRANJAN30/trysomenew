"use client";
import { useState, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

// Color math functions
function hexToRgb(hex: string): [number, number, number] | null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

function contrastRatio(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const Lw = 1, Lb = 0;
  return L > 0.5 ? (Lw + 0.05) / (L + 0.05) : (L + 0.05) / (Lb + 0.05);
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#3b82f6");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;
  const cmyk = rgb ? rgbToCmyk(...rgb) : null;
  const ratio = contrastRatio(hex);
  const isLight = rgb ? (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 128 : false;

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyRow = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-sm text-gray-200 font-mono">{value}</code>
        <button onClick={() => copy(value, id)} className="text-gray-600 hover:text-white transition-colors">
          {copied === id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );

  return (
    <ToolShell title="Color Converter" description="Convert between HEX, RGB, HSL, HSV, and CMYK. Instant color picker included.">
      <div className="space-y-5">
        {/* Picker */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-2xl border border-white/10 shadow-lg" style={{ background: rgb ? `rgb(${rgb.join(",")})` : "#3b82f6" }} />
              <input type="color" value={hex} onChange={e => setHex(e.target.value)}
                className="w-24 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 block mb-1">HEX</label>
              <input
                value={hex}
                onChange={e => {
                  setHex(e.target.value);
                  if (hexToRgb(e.target.value)) setError("");
                  else setError("Invalid hex color");
                }}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
              />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className={`px-3 py-1.5 rounded-lg text-center ${ratio >= 7 ? "bg-emerald-500/20 text-emerald-400" : ratio >= 4.5 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                  AA {ratio >= 4.5 ? "✅" : "❌"} ({ratio.toFixed(2)}:1)
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-center ${ratio >= 7 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  AAA {ratio >= 7 ? "✅" : "❌"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color formats */}
        {rgb && hsl && cmyk && (
          <div className="glass rounded-xl p-5">
            <CopyRow label="HEX" value={hex.toUpperCase()} id="hex" />
            <CopyRow label="RGB" value={`rgb(${rgb.join(", ")})`} id="rgb" />
            <CopyRow label="HSL" value={`hsl(${hsl[0]}deg, ${hsl[1]}%, ${hsl[2]}%)`} id="hsl" />
            <CopyRow label="CSS HSL" value={`hsl(${hsl[0]} ${hsl[1]}% ${hsl[2]}%)`} id="csshsl" />
            <CopyRow label="CMYK" value={`cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`} id="cmyk" />
            <CopyRow label="CSS Filter" value={`invert(${hsl[2]}%) sepia(0%) saturate(${hsl[1]}%) hue-rotate(${hsl[0]}deg)`} id="cssfilter" />
          </div>
        )}

        {/* CSS preview */}
        {rgb && hsl && (
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">CSS Variables Preview</h3>
            <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-gray-400 space-y-1">
              <div><span className="text-blue-400">--color-primary:</span> <span className="text-emerald-400">{hex.toUpperCase()}</span>;</div>
              <div><span className="text-blue-400">--color-primary-rgb:</span> <span className="text-emerald-400">{rgb.join(", ")}</span>;</div>
              <div><span className="text-blue-400">--color-primary-hsl:</span> <span className="text-emerald-400">{hsl.join(" ")}%</span>;</div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
