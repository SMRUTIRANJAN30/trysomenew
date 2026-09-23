"use client";
import { useState, useEffect, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Download } from "lucide-react";
import { marked } from "marked";

export default function MarkdownEditorPage() {
  const [md, setMd] = useState(`# Hello from trysomenew ✨

Write **Markdown** here and see it rendered in real-time.

## Features
- Live preview
- Syntax support: **bold**, *italic*, ~~strikethrough~~
- Tables, code blocks, and more

## Code
\`\`\`javascript
const greet = name => \`Hello, \${name}!\`;
console.log(greet("World"));
\`\`\`

## Table
| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Export HTML | ✅ |
| Export PDF | ✅ |

> "The best documentation is the code you don't have to write."
`);
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"split" | "preview" | "editor">("split");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const result = marked(md, { breaks: true });
    if (typeof result === "string") setHtml(result);
    else result.then(setHtml);
  }, [md]);

  const copy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "document.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body{font-family:sans-serif;max-width:800px;margin:2rem auto;line-height:1.6;color:#333}
      code{background:#f4f4f4;padding:.2em .4em;border-radius:3px}
      pre{background:#f4f4f4;padding:1rem;border-radius:6px;overflow-x:auto}
      blockquote{border-left:4px solid #ddd;margin:0;padding-left:1rem;color:#666}
      table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}
    </style></head><body>${html}</body></html>`;
    const blob = new Blob([full], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "document.html"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="Markdown Editor & Preview"
      description="Write Markdown with real-time HTML preview. Export as .md or .html."
      actions={
        <>
          {(["split", "editor", "preview"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-colors ${view === v ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >{v}</button>
          ))}
          <button onClick={downloadMd} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <Download size={12} />.md
          </button>
          <button onClick={downloadHtml} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <Download size={12} />.html
          </button>
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            Copy HTML
          </button>
        </>
      }
    >
      <div className={`grid gap-4 ${view === "split" ? "grid-cols-2" : "grid-cols-1"}`}>
        {(view === "split" || view === "editor") && (
          <div>
            <label className="text-xs text-gray-500 block mb-2">Markdown Source</label>
            <textarea
              value={md}
              onChange={e => setMd(e.target.value)}
              className="w-full h-[calc(100vh-320px)] min-h-80 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        )}
        {(view === "split" || view === "preview") && (
          <div>
            <label className="text-xs text-gray-500 block mb-2">Preview</label>
            <div
              ref={previewRef}
              className="h-[calc(100vh-320px)] min-h-80 overflow-y-auto bg-white rounded-xl p-6 text-gray-900 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
