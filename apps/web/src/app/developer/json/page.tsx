"use client";
import { useState, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Minimize2, Maximize2, Trash2 } from "lucide-react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState(`{\n  "name": "trysomenew",\n  "version": "1.0.0",\n  "features": ["pdf", "ai", "developer-tools"]\n}`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input]);

  const validate = useCallback(() => {
    try {
      JSON.parse(input);
      setError("✅ Valid JSON");
      setOutput("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [input]);

  const copy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <ToolShell
      title="JSON Formatter & Validator"
      description="Beautify, validate, and minify JSON data. All processing happens in your browser."
    >
      <div className="space-y-4">
        {/* Indent control */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Indent:</label>
            {[2, 4].map((v) => (
              <button
                key={v}
                onClick={() => setIndent(v)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${indent === v ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {v} spaces
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button onClick={format} className="btn-primary flex items-center gap-2">
              <Maximize2 size={14} />Format
            </button>
            <button onClick={minify} className="btn-secondary flex items-center gap-2">
              <Minimize2 size={14} />Minify
            </button>
            <button onClick={validate} className="btn-secondary">Validate</button>
            <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="btn-secondary text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Editor layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Input JSON</label>
              <span className="text-xs text-gray-500">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-80 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              spellCheck={false}
              placeholder="Paste your JSON here..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Output</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-80 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none"
              placeholder="Formatted output will appear here..."
            />
          </div>
        </div>

        {error && (
          <div className={`p-4 rounded-xl border text-sm font-mono ${error.startsWith("✅") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {error}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
