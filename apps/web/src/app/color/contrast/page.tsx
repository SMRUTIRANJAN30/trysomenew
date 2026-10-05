"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { CheckCircle2, XCircle } from "lucide-react";

function hexToRgb(hex: string): [number, number, number] {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0];
}

function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function ContrastCheckerPage() {
  const [foreground, setForeground] = useState("#ffffff");
  const [background, setBackground] = useState("#090e1a");

  const ratio = getContrast(foreground, background);
  const ratioFormatted = ratio.toFixed(2);

  const passNormalAA = ratio >= 4.5;
  const passNormalAAA = ratio >= 7;
  const passLargeAA = ratio >= 3;
  const passLargeAAA = ratio >= 4.5;

  return (
    <ToolShell
      title="WCAG Contrast Checker"
      description="Calculate color contrast ratio according to Web Content Accessibility Guidelines (WCAG 2.1) AA and AAA standards."
    >
      <div className="space-y-6">
        {/* Color Inputs & Live Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Color Selection</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Text Color (Foreground)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={foreground}
                    onChange={(e) => setForeground(e.target.value)}
                    className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 font-mono text-sm text-[var(--foreground)] uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">Background Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-10 h-10 rounded-xl border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 font-mono text-sm text-[var(--foreground)] uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div
            className="rounded-2xl p-8 flex flex-col justify-center border shadow-lg transition-colors"
            style={{ backgroundColor: background, color: foreground, borderColor: `${foreground}30` }}
          >
            <h3 className="text-2xl font-bold mb-2">Live Text Preview</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Good contrast makes documents and web pages legible for users with visual impairments.
            </p>
            <div className="mt-4 pt-4 border-t border-current/20 flex justify-between items-center text-xs opacity-75">
              <span>Small regular text (14px)</span>
              <span className="font-bold">Bold headline (18px+)</span>
            </div>
          </div>
        </div>

        {/* Score & WCAG Breakdown */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-4 mb-6">
            <span className="text-sm font-semibold text-[var(--foreground)]">Contrast Ratio</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[var(--foreground)] font-mono">{ratioFormatted}:1</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                passNormalAA ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"
              }`}>
                {passNormalAA ? "Accessible" : "Low Contrast"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-xl border ${passNormalAA ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground)]">Normal Text AA</span>
                {passNormalAA ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1">Requires 4.5:1</p>
            </div>

            <div className={`p-4 rounded-xl border ${passNormalAAA ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground)]">Normal Text AAA</span>
                {passNormalAAA ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1">Requires 7.0:1</p>
            </div>

            <div className={`p-4 rounded-xl border ${passLargeAA ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground)]">Large Text AA</span>
                {passLargeAA ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1">Requires 3.0:1</p>
            </div>

            <div className={`p-4 rounded-xl border ${passLargeAAA ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground)]">Large Text AAA</span>
                {passLargeAAA ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-1">Requires 4.5:1</p>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
