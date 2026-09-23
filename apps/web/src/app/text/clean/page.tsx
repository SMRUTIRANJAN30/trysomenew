"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Trash2 } from "lucide-react";

export default function TextCleanPage() {
  const [input, setInput] = useState("banana\napple\napple\ncherry\nbanana\ndate\ncherry\nelderberry");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState<{ original: number; result: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const ops = [
    {
      id: "dedup",
      label: "Remove Duplicate Lines",
      desc: "Keep first occurrence of each line",
      icon: "🔁",
      fn: (t: string) => [...new Set(t.split("\n"))].join("\n"),
    },
    {
      id: "sort-az",
      label: "Sort A→Z",
      desc: "Sort lines alphabetically",
      icon: "🔤",
      fn: (t: string) => t.split("\n").sort((a, b) => a.localeCompare(b)).join("\n"),
    },
    {
      id: "sort-za",
      label: "Sort Z→A",
      desc: "Sort lines reverse alphabetically",
      icon: "🔤",
      fn: (t: string) => t.split("\n").sort((a, b) => b.localeCompare(a)).join("\n"),
    },
    {
      id: "sort-num",
      label: "Sort Numerically",
      desc: "Sort lines as numbers",
      icon: "🔢",
      fn: (t: string) => t.split("\n").sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"),
    },
    {
      id: "reverse",
      label: "Reverse Lines",
      desc: "Flip the order of all lines",
      icon: "↕️",
      fn: (t: string) => t.split("\n").reverse().join("\n"),
    },
    {
      id: "shuffle",
      label: "Shuffle Lines",
      desc: "Randomize line order",
      icon: "🔀",
      fn: (t: string) => {
        const lines = t.split("\n");
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        return lines.join("\n");
      },
    },
    {
      id: "trim-whitespace",
      label: "Trim Whitespace",
      desc: "Remove leading/trailing spaces from each line",
      icon: "✂️",
      fn: (t: string) => t.split("\n").map(l => l.trim()).join("\n"),
    },
    {
      id: "remove-blank",
      label: "Remove Blank Lines",
      desc: "Delete all empty lines",
      icon: "🗑️",
      fn: (t: string) => t.split("\n").filter(l => l.trim().length > 0).join("\n"),
    },
    {
      id: "reverse-chars",
      label: "Reverse Characters",
      desc: "Reverse characters in each line",
      icon: "⬅️",
      fn: (t: string) => t.split("\n").map(l => l.split("").reverse().join("")).join("\n"),
    },
    {
      id: "number-lines",
      label: "Number Lines",
      desc: "Prefix each line with its line number",
      icon: "🔢",
      fn: (t: string) => t.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"),
    },
  ];

  const apply = (fn: (t: string) => string) => {
    const original = input.split("\n").length;
    const result = fn(input);
    setOutput(result);
    setStats({ original, result: result.split("\n").length });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="Text Utilities" description="Remove duplicates, sort, shuffle, trim, number lines, and more — all instantly in your browser.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Input Text</label>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              className="w-full h-60 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Paste your text or list here..." />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Result</label>
              {stats && (
                <span className="text-xs text-gray-500">{stats.original} → {stats.result} lines</span>
              )}
            </div>
            <div className="relative h-60">
              <textarea readOnly value={output}
                className="w-full h-full bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none" />
              {output && (
                <button onClick={copy}
                  className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-white transition-colors">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {ops.map(op => (
            <button key={op.id} onClick={() => apply(op.fn)}
              className="flex flex-col items-center gap-1.5 p-3 glass rounded-xl hover:bg-white/10 transition-colors text-center border border-white/5 hover:border-blue-500/30"
              title={op.desc}
            >
              <span className="text-lg">{op.icon}</span>
              <span className="text-xs text-gray-300 leading-tight">{op.label}</span>
            </button>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
