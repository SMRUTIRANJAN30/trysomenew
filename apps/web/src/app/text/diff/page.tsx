"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

// Simple line-by-line diff
function computeDiff(a: string, b: string): { type: "same" | "add" | "remove"; text: string }[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: { type: "same" | "add" | "remove"; text: string }[] = [];

  const lcs = (a: string[], b: string[]): string[][] => {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);

    const seq: string[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i-1] === b[j-1]) { seq.unshift(a[i-1]); i--; j--; }
      else if (dp[i-1][j] > dp[i][j-1]) i--;
      else j--;
    }
    return [seq, a, b];
  };

  const [common] = lcs(aLines, bLines);
  let ai = 0, bi = 0;

  for (const line of common) {
    while (ai < aLines.length && aLines[ai] !== line) {
      result.push({ type: "remove", text: aLines[ai++] });
    }
    while (bi < bLines.length && bLines[bi] !== line) {
      result.push({ type: "add", text: bLines[bi++] });
    }
    result.push({ type: "same", text: line });
    ai++; bi++;
  }
  while (ai < aLines.length) result.push({ type: "remove", text: aLines[ai++] });
  while (bi < bLines.length) result.push({ type: "add", text: bLines[bi++] });

  return result;
}

export default function TextDiffPage() {
  const [textA, setTextA] = useState("The quick brown fox\njumps over the lazy dog.\nThis line is the same.\nOld content here.");
  const [textB, setTextB] = useState("The quick brown fox\nleaps over the lazy cat.\nThis line is the same.\nNew content here.");
  const [showDiff, setShowDiff] = useState(false);

  const diff = computeDiff(textA, textB);
  const adds = diff.filter(d => d.type === "add").length;
  const removes = diff.filter(d => d.type === "remove").length;

  return (
    <ToolShell title="Text Compare / Diff" description="Find line-by-line differences between two blocks of text. Green = added, Red = removed.">
      <div className="space-y-4">
        {!showDiff ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Original Text (A)</label>
                <textarea value={textA} onChange={e => setTextA(e.target.value)}
                  className="w-full h-48 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Paste original text..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Modified Text (B)</label>
                <textarea value={textB} onChange={e => setTextB(e.target.value)}
                  className="w-full h-48 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Paste modified text..." />
              </div>
            </div>
            <button onClick={() => setShowDiff(true)} className="btn-primary w-full">Compare Texts</button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  {adds} added
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                  {removes} removed
                </span>
              </div>
              <button onClick={() => setShowDiff(false)} className="btn-secondary text-sm py-1.5">← Back to Edit</button>
            </div>

            <div className="bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 space-y-0.5 font-mono text-sm max-h-[60vh] overflow-y-auto">
                {diff.map((line, i) => (
                  <div key={i} className={`px-3 py-0.5 rounded flex items-start gap-3 ${
                    line.type === "add" ? "bg-emerald-500/15 text-emerald-300" :
                    line.type === "remove" ? "bg-red-500/15 text-red-300" : "text-gray-400"
                  }`}>
                    <span className={`w-4 text-center shrink-0 ${line.type === "add" ? "text-emerald-500" : line.type === "remove" ? "text-red-500" : "text-gray-700"}`}>
                      {line.type === "add" ? "+" : line.type === "remove" ? "−" : " "}
                    </span>
                    <span className="whitespace-pre-wrap break-all">{line.text || "\u00A0"}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
