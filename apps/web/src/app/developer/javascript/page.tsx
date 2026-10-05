"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Minimize2, Sparkles } from "lucide-react";

function formatJs(code: string): string {
  let indent = 0;
  const tab = "  ";
  const lines = code.split("\n");
  const formattedLines: string[] = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("}") || line.startsWith("]") || line.startsWith(")")) {
      indent = Math.max(0, indent - 1);
    }

    formattedLines.push(tab.repeat(indent) + line);

    if (line.endsWith("{") || line.endsWith("[") || line.endsWith("(")) {
      indent++;
    }
  }
  return formattedLines.join("\n");
}

function minifyJs(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1") // strip comments
    .replace(/\s+/g, " ")
    .replace(/\s*([;={}()[\],])\s*/g, "$1")
    .trim();
}

export default function JsFormatterPage() {
  const [code, setCode] = useState(
    `function calculateIntegrity(bytes){const hash=crypto.subtle.digest("SHA-256",bytes);return hash.then(buf=>{return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");});}`
  );
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setCode(formatJs(code));
  };

  const handleMinify = () => {
    setCode(minifyJs(code));
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="JavaScript Formatter & Minifier"
      description="Beautify raw JavaScript / TypeScript code with structured indentation or minify scripts for production."
      actions={
        <div className="flex gap-2">
          <button onClick={handleFormat} className="btn-primary flex items-center gap-1.5 text-xs py-2">
            <Sparkles size={14} /> Beautify JS
          </button>
          <button onClick={handleMinify} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            <Minimize2 size={14} /> Minify JS
          </button>
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full min-h-[380px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Paste JavaScript here..."
          />
          <div className="flex justify-between items-center text-xs text-[var(--muted)] mt-2">
            <span>Size: {new Blob([code]).size} bytes</span>
            <span>Lines: {code.split("\n").length}</span>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
