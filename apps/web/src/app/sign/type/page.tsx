"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, Type, Check, Copy } from "lucide-react";

const FONTS = [
  { id: "cursive", name: "Classic Cursive", family: "cursive, 'Brush Script MT', sans-serif" },
  { id: "italic", name: "Modern Script", family: "'Segoe Script', 'Apple Chancery', cursive" },
  { id: "formal", name: "Executive Calligraphy", family: "Georgia, 'Times New Roman', serif" },
  { id: "hand", name: "Casual Handwritten", family: "'Comic Sans MS', cursive, sans-serif" },
];

export default function TypeSignaturePage() {
  const [name, setName] = useState("Smrutiranjan Sahoo");
  const [selectedFont, setSelectedFont] = useState(FONTS[0].id);
  const [color, setColor] = useState("#1d4ed8");

  const downloadSignature = (fontFamily: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `italic 44px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(name, 300, 100);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-signature.png`;
    a.click();
  };

  return (
    <ToolShell
      title="Type Digital Signature (Phase 3)"
      description="Turn your typed name into beautiful cursive and calligraphic signatures with transparent PNG export."
    >
      <div className="space-y-6">
        {/* Name Input */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--muted)] block mb-1">Your Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-base font-semibold text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Ink Color</label>
              <div className="flex items-center gap-3">
                {[
                  { name: "Blue", hex: "#1d4ed8" },
                  { name: "Black", hex: "#0f172a" },
                  { name: "Emerald", hex: "#059669" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      color === c.hex ? "scale-110 border-blue-500 shadow-md" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Signature Font Styles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FONTS.map((f) => (
            <div
              key={f.id}
              className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex justify-between items-center text-xs text-[var(--muted)]">
                <span>{f.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">
                  Transparent PNG
                </span>
              </div>

              <div className="py-6 text-center border-y border-[var(--border-subtle)] bg-white/5 rounded-xl">
                <span
                  className="text-3xl font-medium tracking-wide italic select-none"
                  style={{ fontFamily: f.family, color }}
                >
                  {name || "Your Name"}
                </span>
              </div>

              <button
                onClick={() => downloadSignature(f.family)}
                disabled={!name.trim()}
                className="btn-secondary w-full flex items-center justify-center gap-2 text-xs py-2.5"
              >
                <Download size={13} /> Download {f.name} PNG
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
