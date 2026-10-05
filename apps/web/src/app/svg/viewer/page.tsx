"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Download, Upload } from "lucide-react";

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="45" stroke="#3b82f6" stroke-width="4" fill="#090e1a"/>
  <path d="M50 25 L65 75 L35 75 Z" fill="#06b6d4" />
</svg>`;

export default function SvgViewerPage() {
  const [svgCode, setSvgCode] = useState(SAMPLE_SVG);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setSvgCode(event.target.result);
        }
      };
      reader.readAsText(f);
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graphic.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="SVG Viewer & Inspector"
      description="Paste or upload raw SVG code to preview rendering, inspect markup, and download locally."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="glass rounded-2xl p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--foreground)]">SVG Source Code</span>
              <label className="btn-secondary py-1 px-3 text-xs cursor-pointer flex items-center gap-1.5">
                <Upload size={13} />
                <span>Upload SVG</span>
                <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              className="w-full flex-1 min-h-[300px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="<svg ...></svg>"
            />
            <div className="flex gap-2">
              <button onClick={copy} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs py-2.5">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied Source" : "Copy Code"}
              </button>
              <button onClick={downloadSvg} className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2.5">
                <Download size={14} />
                Download SVG
              </button>
            </div>
          </div>

          {/* Render Preview */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <span className="text-xs font-semibold text-[var(--foreground)] mb-4">Rendered Preview</span>
            <div
              className="flex-1 min-h-[300px] rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] flex items-center justify-center p-6 overflow-hidden [&>svg]:max-w-full [&>svg]:max-h-[280px]"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--muted-text)] text-center">
              Rendered directly by browser SVG engine with zero latency
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
