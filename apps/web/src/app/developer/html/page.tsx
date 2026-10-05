"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Minimize2, Sparkles } from "lucide-react";

function formatHtml(html: string): string {
  let formatted = "";
  let indent = 0;
  const tab = "  ";
  // Clean newlines
  const tokens = html.replace(/>\s*</g, "><").replace(/</g, "~#~<").split("~#~").filter(Boolean);

  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;

    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + token + "\n";
    } else if (token.startsWith("<") && !token.endsWith("/>") && !token.startsWith("<!") && !token.startsWith("<?")) {
      // Check if self closing or void tags
      const voidTags = ["<area", "<base", "<br", "<col", "<embed", "<hr", "<img", "<input", "<link", "<meta", "<param", "<source", "<track", "<wbr"];
      const isVoid = voidTags.some((vt) => token.toLowerCase().startsWith(vt));
      formatted += tab.repeat(indent) + token + "\n";
      if (!isVoid) {
        indent++;
      }
    } else {
      formatted += tab.repeat(indent) + token + "\n";
    }
  }
  return formatted.trim();
}

function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export default function HtmlFormatterPage() {
  const [code, setCode] = useState(
    `<div class="container"><header><h1>trysomenew</h1><nav><a href="/tools">All Tools</a></nav></header><main><p>Fast, local-first workspace.</p></main></div>`
  );
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setCode(formatHtml(code));
  };

  const handleMinify = () => {
    setCode(minifyHtml(code));
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="HTML Formatter & Minifier"
      description="Beautify nested HTML code with clean indentation or minify markup to reduce network payload size."
      actions={
        <div className="flex gap-2">
          <button onClick={handleFormat} className="btn-primary flex items-center gap-1.5 text-xs py-2">
            <Sparkles size={14} /> Beautify HTML
          </button>
          <button onClick={handleMinify} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            <Minimize2 size={14} /> Minify HTML
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
            placeholder="Paste HTML here..."
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
