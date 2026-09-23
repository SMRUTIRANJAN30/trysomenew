"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

function hexToHsl(hex: string): [number, number, number] | null {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!r) return null;
  let [rv, gv, bv] = [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
  const max = Math.max(rv, gv, bv), min = Math.min(rv, gv, bv);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rv: h = ((gv - bv) / d + (gv < bv ? 6 : 0)) / 6; break;
      case gv: h = ((bv - rv) / d + 2) / 6; break;
      case bv: h = ((rv - gv) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3);
  }
  return "#" + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

type PaletteType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

function generatePalette(baseHex: string, type: PaletteType): string[] {
  const hsl = hexToHsl(baseHex);
  if (!hsl) return [];
  const [h, s, l] = hsl;

  switch (type) {
    case "complementary":
      return [baseHex, hslToHex((h + 180) % 360, s, l)];
    case "analogous":
      return [hslToHex((h - 30 + 360) % 360, s, l), baseHex, hslToHex((h + 30) % 360, s, l)];
    case "triadic":
      return [baseHex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case "split-complementary":
      return [baseHex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    case "tetradic":
      return [baseHex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
    case "monochromatic":
      return [20, 35, 50, 65, 80].map(lv => hslToHex(h, s, lv));
    default:
      return [baseHex];
  }
}

const PALETTE_TYPES: { id: PaletteType; label: string; desc: string }[] = [
  { id: "complementary", label: "Complementary", desc: "2 opposite colors" },
  { id: "analogous", label: "Analogous", desc: "3 adjacent colors" },
  { id: "triadic", label: "Triadic", desc: "3 evenly spaced" },
  { id: "split-complementary", label: "Split Complementary", desc: "Base + 2 adjacent complements" },
  { id: "tetradic", label: "Tetradic", desc: "4 rectangle colors" },
  { id: "monochromatic", label: "Monochromatic", desc: "5 shades of one hue" },
];

export default function ColorPalettePage() {
  const [base, setBase] = useState("#3b82f6");
  const [type, setType] = useState<PaletteType>("analogous");
  const [copied, setCopied] = useState<string | null>(null);

  const palette = generatePalette(base, type);

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    copy(palette.join(", "), "all");
  };

  return (
    <ToolShell title="Color Palette Generator" description="Generate complementary, analogous, triadic, and more color palettes from any base color.">
      <div className="space-y-5">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-4">
            <input type="color" value={base} onChange={e => setBase(e.target.value)}
              className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent p-0.5" />
            <div className="flex-1">
              <input value={base} onChange={e => setBase(e.target.value)}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase" />
              <p className="text-xs text-gray-600 mt-1">Base color — all palettes generate from this</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PALETTE_TYPES.map(pt => (
              <button key={pt.id} onClick={() => setType(pt.id)}
                className={`px-3 py-2 text-left rounded-xl border transition-colors ${type === pt.id ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                <div className="text-sm font-medium">{pt.label}</div>
                <div className="text-xs text-gray-500">{pt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Palette */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">{PALETTE_TYPES.find(p => p.id === type)?.label} Palette</h3>
            <button onClick={copyAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
              {copied === "all" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              Copy all HEX
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {palette.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <button
                  className="w-20 h-20 rounded-2xl border-2 border-transparent hover:border-white/30 transition-all shadow-lg cursor-pointer"
                  style={{ background: color }}
                  onClick={() => copy(color.toUpperCase(), color)}
                  title={`Click to copy ${color}`}
                />
                <code className="text-xs text-gray-400">{color.toUpperCase()}</code>
                {copied === color && <span className="text-xs text-green-400">Copied!</span>}
              </div>
            ))}
          </div>

          {/* Horizontal swatch strip */}
          <div className="mt-4 flex h-12 rounded-xl overflow-hidden">
            {palette.map((color, i) => (
              <div key={i} className="flex-1" style={{ background: color }} title={color} />
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
