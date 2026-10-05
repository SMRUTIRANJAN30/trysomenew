"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Pipette } from "lucide-react";

export default function ColorPickerPage() {
  const [color, setColor] = useState("#3b82f6");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [59, 130, 246];
  };

  const [r, g, b] = hexToRgb(color);

  // Compute HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
  }
  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Complementary color
  const compHDeg = (hDeg + 180) % 360;
  const compColor = `hsl(${compHDeg}, ${sPct}%, ${lPct}%)`;

  // Shades / Lightness steps
  const shades = [15, 30, 50, 70, 85].map((lightness) => `hsl(${hDeg}, ${sPct}%, ${lightness}%)`);

  return (
    <ToolShell
      title="Color Picker & Inspector"
      description="Inspect colors, generate complementary palettes, and export values in HEX, RGB, HSL, and CSS formats."
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border border-[var(--border-subtle)] shadow-xl transition-all"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                title="Click to pick a color"
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-lg font-mono font-bold uppercase tracking-wider text-[var(--foreground)] w-full max-w-xs"
                />
                <button
                  onClick={() => copy(color, "hex")}
                  className="btn-secondary flex items-center gap-1.5 py-3"
                >
                  {copiedKey === "hex" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  Copy
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-3 rounded-xl flex justify-between items-center">
                  <span className="text-[var(--muted)]">RGB:</span>
                  <span className="text-[var(--foreground)] font-semibold">{r}, {g}, {b}</span>
                  <button onClick={() => copy(`rgb(${r}, ${g}, ${b})`, "rgb")} className="text-blue-500 hover:text-blue-400">
                    {copiedKey === "rgb" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] p-3 rounded-xl flex justify-between items-center">
                  <span className="text-[var(--muted)]">HSL:</span>
                  <span className="text-[var(--foreground)] font-semibold">{hDeg}°, {sPct}%, {lPct}%</span>
                  <button onClick={() => copy(`hsl(${hDeg}, ${sPct}%, ${lPct}%)`, "hsl")} className="text-blue-500 hover:text-blue-400">
                    {copiedKey === "hsl" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tonal Shades & Complementary Palette */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Pipette size={16} className="text-blue-500" /> Lightness Steps & Palette
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {shades.map((shade, idx) => (
              <div
                key={idx}
                className="h-16 rounded-xl border border-[var(--border-subtle)] flex items-end p-2 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: shade }}
                onClick={() => copy(shade, `shade-${idx}`)}
                title="Click to copy CSS HSL"
              >
                <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-1 rounded">
                  {copiedKey === `shade-${idx}` ? "Copied" : `${[15, 30, 50, 70, 85][idx]}%`}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs text-[var(--muted)]">Complementary Tone:</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: compColor }} />
              <code className="text-xs font-mono text-[var(--foreground)]">{compColor}</code>
              <button onClick={() => copy(compColor, "comp")} className="btn-secondary py-1 px-2.5 text-xs">
                {copiedKey === "comp" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
