"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Download, Zap } from "lucide-react";

function optimizeSvg(raw: string): string {
  let cleaned = raw
    // Strip XML declaration & doctype
    .replace(/<\?xml[^>]*\?>/gi, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    // Strip XML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Strip Illustrator/Inkscape metadata & sodipodi tags
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<sodipodi:[^>]*>/gi, "")
    .replace(/<\/sodipodi:[^>]*>/gi, "")
    .replace(/<inkscape:[^>]*>/gi, "")
    .replace(/<\/inkscape:[^>]*>/gi, "")
    // Strip redundant whitespace
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();

  return cleaned;
}

export default function SvgOptimizePage() {
  const [inputSvg, setInputSvg] = useState(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Generator: trysomenew SVG Export -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"/>
  </metadata>
  <circle cx="50" cy="50" r="40" fill="#3b82f6" />
</svg>`);
  const [outputSvg, setOutputSvg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    const res = optimizeSvg(inputSvg);
    setOutputSvg(res);
  };

  const origSize = new Blob([inputSvg]).size;
  const optSize = outputSvg ? new Blob([outputSvg]).size : origSize;
  const savings = origSize > 0 && outputSvg ? Math.round(((origSize - optSize) / origSize) * 100) : 0;

  const copy = () => {
    navigator.clipboard.writeText(outputSvg || inputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const text = outputSvg || inputSvg;
    const blob = new Blob([text], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="SVG Optimizer & Minifier"
      description="Remove unnecessary metadata, comments, editor namespaces, and whitespace to compress SVG file size."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 flex flex-col space-y-3">
            <div className="flex justify-between items-center text-xs text-[var(--muted)]">
              <span>Original SVG</span>
              <span className="font-mono">{origSize} bytes</span>
            </div>
            <textarea
              value={inputSvg}
              onChange={(e) => {
                setInputSvg(e.target.value);
                setOutputSvg("");
              }}
              className="w-full flex-1 min-h-[260px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none"
              placeholder="Paste SVG markup..."
            />
            <button onClick={handleOptimize} className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5">
              <Zap size={14} /> Optimize SVG
            </button>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col space-y-3">
            <div className="flex justify-between items-center text-xs text-[var(--muted)]">
              <span>Optimized Output</span>
              {outputSvg && (
                <span className="font-mono text-emerald-500 font-bold">
                  {optSize} bytes ({savings}% smaller)
                </span>
              )}
            </div>
            <textarea
              readOnly
              value={outputSvg || "Click 'Optimize SVG' to process..."}
              className="w-full flex-1 min-h-[260px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={copy}
                disabled={!outputSvg}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs py-2.5 disabled:opacity-50"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={download}
                disabled={!outputSvg}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2.5 disabled:opacity-50"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
