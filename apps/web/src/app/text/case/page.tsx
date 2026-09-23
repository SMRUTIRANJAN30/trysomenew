"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

const cases = [
  {
    id: "uppercase",
    label: "UPPERCASE",
    fn: (t: string) => t.toUpperCase(),
  },
  {
    id: "lowercase",
    label: "lowercase",
    fn: (t: string) => t.toLowerCase(),
  },
  {
    id: "titlecase",
    label: "Title Case",
    fn: (t: string) =>
      t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    id: "sentencecase",
    label: "Sentence case",
    fn: (t: string) =>
      t.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()).replace(/\s+[A-Z]/g, c => c.toLowerCase()).replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()),
  },
  {
    id: "camelcase",
    label: "camelCase",
    fn: (t: string) =>
      t.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, c => c.toLowerCase()),
  },
  {
    id: "pascalcase",
    label: "PascalCase",
    fn: (t: string) =>
      t.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, c => c.toUpperCase()),
  },
  {
    id: "snakecase",
    label: "snake_case",
    fn: (t: string) =>
      t.replace(/([A-Z])/g, "_$1").replace(/[-\s]+/g, "_").toLowerCase().replace(/^_/, ""),
  },
  {
    id: "kebabcase",
    label: "kebab-case",
    fn: (t: string) =>
      t.replace(/([A-Z])/g, "-$1").replace(/[\s_]+/g, "-").toLowerCase().replace(/^-/, ""),
  },
  {
    id: "alternating",
    label: "aLtErNaTiNg CaSe",
    fn: (t: string) =>
      t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
  },
  {
    id: "inverse",
    label: "iNVERSE cASE",
    fn: (t: string) =>
      t.split("").map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(""),
  },
];

export default function CaseConverterPage() {
  const [input, setInput] = useState("the quick brown fox jumps over the lazy dog");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (v: string, id: string) => {
    navigator.clipboard.writeText(v);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolShell title="Text Case Converter" description="Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.">
      <div className="space-y-5">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-32 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Type or paste your text here..."
        />

        <div className="space-y-2">
          {cases.map(c => {
            const result = input ? c.fn(input) : "";
            return (
              <div key={c.id} className="glass rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{c.label}</div>
                  <div className="text-sm text-gray-200 break-words">{result || <span className="text-gray-600 italic">Start typing above...</span>}</div>
                </div>
                <button
                  onClick={() => copy(result, c.id)}
                  disabled={!result}
                  className="shrink-0 text-gray-500 hover:text-white transition-colors disabled:opacity-30 mt-1"
                >
                  {copied === c.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToolShell>
  );
}
