"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

export default function SvgDataUriPage() {
  const [svgInput, setSvgInput] = useState(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // URL encode SVG safely
  const encodedSvg = encodeURIComponent(svgInput.trim().replace(/\s+/g, " "))
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  const rawDataUri = `data:image/svg+xml,${encodedSvg}`;
  const cssBackground = `background-image: url("${rawDataUri}");`;
  const htmlImgTag = `<img src="${rawDataUri}" alt="SVG Icon" />`;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <ToolShell
      title="SVG to Data URI"
      description="Convert SVG markup into encoded Data URIs for inline CSS background-image, HTML img tags, or JavaScript strings."
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <label className="text-xs font-semibold text-[var(--foreground)] block">Raw SVG Code</label>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            className="w-full h-36 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none"
            placeholder="<svg ...></svg>"
          />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[var(--foreground)]">Raw Data URI</span>
              <button onClick={() => copy(rawDataUri, "raw")} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                {copiedKey === "raw" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copiedKey === "raw" ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="block bg-[var(--input-bg)] p-3 rounded-xl text-xs font-mono text-[var(--muted)] break-all border border-[var(--input-border)]">
              {rawDataUri}
            </code>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[var(--foreground)]">CSS background-image</span>
              <button onClick={() => copy(cssBackground, "css")} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                {copiedKey === "css" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copiedKey === "css" ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="block bg-[var(--input-bg)] p-3 rounded-xl text-xs font-mono text-[var(--muted)] break-all border border-[var(--input-border)]">
              {cssBackground}
            </code>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-[var(--foreground)]">HTML &lt;img&gt; Tag</span>
              <button onClick={() => copy(htmlImgTag, "html")} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1.5">
                {copiedKey === "html" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copiedKey === "html" ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="block bg-[var(--input-bg)] p-3 rounded-xl text-xs font-mono text-[var(--muted)] break-all border border-[var(--input-border)]">
              {htmlImgTag}
            </code>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
