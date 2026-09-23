"use client";
import { useState, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("Send results to alice@example.com or bob@test.org. Invalid: @no, noDomain@");
  const [copied, setCopied] = useState(false);

  const getMatches = useCallback(() => {
    if (!pattern) return { matches: [], error: "", highlighted: testStr };
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: Record<string, string> | undefined }[] = [];

      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups });
          if (m[0].length === 0) re.lastIndex++; // Prevent infinite loop on zero-length match
        }
      } else {
        const m = re.exec(testStr);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups });
      }

      // Build highlighted output
      let highlighted = "";
      let last = 0;
      const re2 = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let m2: RegExpExecArray | null;
      while ((m2 = re2.exec(testStr)) !== null) {
        highlighted += escapeHtml(testStr.slice(last, m2.index));
        highlighted += `<mark class="bg-yellow-400/30 text-yellow-300 rounded px-0.5">${escapeHtml(m2[0])}</mark>`;
        last = m2.index + m2[0].length;
        if (m2[0].length === 0) re2.lastIndex++;
      }
      highlighted += escapeHtml(testStr.slice(last));

      return { matches, error: "", highlighted };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message, highlighted: escapeHtml(testStr) };
    }
  }, [pattern, flags, testStr]);

  const { matches, error, highlighted } = getMatches();

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const copy = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="Regex Tester" description="Test regular expressions with live match highlighting, match list, and named groups.">
      <div className="space-y-4">
        {/* Pattern */}
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex items-stretch gap-2">
            <span className="flex items-center px-3 text-gray-500 text-lg font-mono">/</span>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter regex pattern..."
            />
            <span className="flex items-center px-3 text-gray-500 text-lg font-mono">/</span>
            <input
              value={flags}
              onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
              className="w-16 bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-blue-400 focus:outline-none"
              placeholder="flags"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { f: "g", label: "global (g)" },
              { f: "i", label: "ignore case (i)" },
              { f: "m", label: "multiline (m)" },
              { f: "s", label: "dotAll (s)" },
            ].map(({ f, label }) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${flags.includes(f) ? "bg-blue-600/30 border-blue-500 text-blue-300" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"}`}
              >{label}</button>
            ))}
            <button onClick={copy} className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2">
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              Copy regex
            </button>
          </div>
          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2">{error}</div>}
        </div>

        {/* Test string */}
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Test String</label>
          <textarea
            value={testStr}
            onChange={e => setTestStr(e.target.value)}
            className="w-full h-32 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Highlighted result */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Highlighted Matches</label>
            <span className={`text-xs px-2 py-0.5 rounded-full ${error ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
              {error ? "Error" : `${matches.length} match${matches.length !== 1 ? "es" : ""}`}
            </span>
          </div>
          <div
            className="min-h-20 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

        {/* Match list */}
        {matches.length > 0 && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Match Details</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="text-gray-600 w-4">{i + 1}</span>
                  <code className="text-yellow-300 bg-yellow-400/10 rounded px-1">{m.match}</code>
                  <span className="text-gray-600">@ index {m.index}</span>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <span className="text-blue-400">{JSON.stringify(m.groups)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
