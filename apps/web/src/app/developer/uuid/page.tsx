"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, RefreshCw, Layers } from "lucide-react";

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const u = crypto.randomUUID();
      result.push(uppercase ? u.toUpperCase() : u);
    }
    setUuids(result);
  };

  const copy = (v: string, i: number) => {
    navigator.clipboard.writeText(v);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <ToolShell title="UUID Generator" description="Generate version 4 UUIDs using the browser's built-in crypto.randomUUID(). Fully local, cryptographically random.">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Count:</label>
              {[1, 5, 10, 25].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-colors ${count === n ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
                >{n}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 ml-auto cursor-pointer">
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-blue-500" />
              <span className="text-sm text-gray-300">Uppercase</span>
            </label>
          </div>
          <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2">
            <RefreshCw size={16} />Generate UUIDs
          </button>
        </div>

        {uuids.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{uuids.length} UUID{uuids.length > 1 ? "s" : ""} generated</span>
              <button onClick={copyAll} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                {copiedAll ? <Check size={14} className="text-green-400" /> : <Layers size={14} />}
                {copiedAll ? "Copied all!" : "Copy all"}
              </button>
            </div>
            <div className="space-y-2">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between gap-3 glass rounded-xl px-4 py-3">
                  <code className="text-sm font-mono text-gray-200">{uuid}</code>
                  <button onClick={() => copy(uuid, i)} className="shrink-0 text-gray-400 hover:text-white transition-colors">
                    {copied === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">About UUID v4</h3>
          <p className="text-xs text-gray-500 leading-relaxed">UUID v4 is randomly generated using 122 bits of entropy from <code className="text-blue-400">crypto.randomUUID()</code>. The probability of a collision is astronomically low (~5.3×10⁻³⁶ per pair). Safe for use as database primary keys, session IDs, and correlation tokens.</p>
        </div>
      </div>
    </ToolShell>
  );
}
