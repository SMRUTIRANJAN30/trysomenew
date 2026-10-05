"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function GradientGeneratorPage() {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#9333ea");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [copied, setCopied] = useState(false);

  const gradientCss =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const fullCssRule = `background: ${gradientCss};`;

  const copy = () => {
    navigator.clipboard.writeText(fullCssRule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    const randomHex = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    setColor1(randomHex());
    setColor2(randomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <ToolShell
      title="CSS Gradient Generator"
      description="Design modern linear and radial gradients with custom angle controls and copy production-ready CSS."
      actions={
        <button onClick={randomize} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
          <RefreshCw size={14} /> Randomize
        </button>
      }
    >
      <div className="space-y-6">
        {/* Visual Preview */}
        <div
          className="h-64 sm:h-80 rounded-3xl border border-[var(--border-subtle)] shadow-2xl transition-all"
          style={{ background: gradientCss }}
        />

        {/* Controls */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex gap-2">
            {(["linear", "radial"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border capitalize ${
                  type === t
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-[var(--border-subtle)] text-[var(--muted)]"
                }`}
              >
                {t} Gradient
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Start Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 font-mono text-sm text-[var(--foreground)] uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">End Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 font-mono text-sm text-[var(--foreground)] uppercase"
                />
              </div>
            </div>
          </div>

          {type === "linear" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-[var(--muted)]">Direction Angle</label>
                <span className="text-xs font-mono text-[var(--foreground)]">{angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          )}

          {/* Copyable CSS */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
            <code className="text-xs font-mono text-[var(--foreground)] truncate flex-1 bg-[var(--input-bg)] p-3 rounded-xl border border-[var(--input-border)]">
              {fullCssRule}
            </code>
            <button onClick={copy} className="btn-primary flex items-center gap-2 py-3 px-5 text-xs whitespace-nowrap">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied CSS!" : "Copy CSS"}
            </button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
