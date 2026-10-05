"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Minimize2, Sparkles } from "lucide-react";

function formatCss(css: string): string {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n\n")
    .replace(/,\s*/g, ", ")
    .replace(/:\s*/g, ": ")
    .replace(/\n\s*\n\s*\}/g, "\n}")
    .trim();
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    .trim();
}

export default function CssFormatterPage() {
  const [code, setCode] = useState(
    `.header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: #060911; border-bottom: 1px solid rgba(255, 255, 255, 0.08); } .header .logo { font-size: 1.25rem; font-weight: 700; color: #3b82f6; }`
  );
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setCode(formatCss(code));
  };

  const handleMinify = () => {
    setCode(minifyCss(code));
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="CSS Formatter & Minifier"
      description="Beautify raw stylesheets with standard spacing and indentation or minify CSS rules for fast asset delivery."
      actions={
        <div className="flex gap-2">
          <button onClick={handleFormat} className="btn-primary flex items-center gap-1.5 text-xs py-2">
            <Sparkles size={14} /> Beautify CSS
          </button>
          <button onClick={handleMinify} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            <Minimize2 size={14} /> Minify CSS
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
            placeholder="Paste CSS here..."
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
