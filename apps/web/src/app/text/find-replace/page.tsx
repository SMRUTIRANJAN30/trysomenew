"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Replace } from "lucide-react";

export default function FindReplacePage() {
  const [text, setText] = useState(
    `TrySomeNew is a fast workspace. With TrySomeNew, you can merge documents and process files securely.`
  );
  const [findStr, setFindStr] = useState("TrySomeNew");
  const [replaceStr, setReplaceStr] = useState("trysomenew");
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate matches count
  let matchCount = 0;
  if (findStr) {
    try {
      const flags = matchCase ? "g" : "gi";
      const regex = useRegex
        ? new RegExp(findStr, flags)
        : new RegExp(findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = text.match(regex);
      matchCount = matches ? matches.length : 0;
    } catch {
      matchCount = 0;
    }
  }

  const handleReplaceAll = () => {
    if (!findStr) return;
    try {
      const flags = matchCase ? "g" : "gi";
      const regex = useRegex
        ? new RegExp(findStr, flags)
        : new RegExp(findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      setText(text.replace(regex, replaceStr));
    } catch (e) {
      console.error(e);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="Find & Replace"
      description="Perform lightning-fast text replacements with regular expression and case-sensitivity controls."
      actions={
        <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy Result"}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Find text or pattern</label>
              <input
                value={findStr}
                onChange={(e) => setFindStr(e.target.value)}
                placeholder="Find..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Replace with</label>
              <input
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                placeholder="Replace with..."
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-4 text-xs text-[var(--foreground)]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => setMatchCase(e.target.checked)}
                  className="rounded border-[var(--input-border)] text-blue-600 focus:ring-blue-500"
                />
                Match Case
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useRegex}
                  onChange={(e) => setUseRegex(e.target.checked)}
                  className="rounded border-[var(--input-border)] text-blue-600 focus:ring-blue-500"
                />
                Use Regular Expression
              </label>

              <span className="text-[var(--muted-text)] font-mono">
                {matchCount} {matchCount === 1 ? "match" : "matches"} found
              </span>
            </div>

            <button
              onClick={handleReplaceAll}
              disabled={matchCount === 0}
              className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 disabled:opacity-50"
            >
              <Replace size={14} /> Replace All ({matchCount})
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="glass rounded-2xl p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[300px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Type or paste your text here..."
          />
        </div>
      </div>
    </ToolShell>
  );
}
