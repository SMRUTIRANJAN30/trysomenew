"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";
import SparkMD5 from "spark-md5";

const algos = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const;
type Algo = typeof algos[number];

async function hashText(text: string, algo: Algo): Promise<string> {
  if (algo === "MD5") {
    return SparkMD5.hash(text);
  }
  const name = algo.replace("-", "-") as AlgorithmIdentifier;
  const buf = await crypto.subtle.digest(name as AlgorithmIdentifier, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algo, string>>({} as Record<Algo, string>);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const generate = async () => {
    if (!input && !file) return;
    setLoading(true);
    try {
      let text = input;
      if (file) {
        text = await file.text();
      }
      const results = {} as Record<Algo, string>;
      for (const algo of algos) {
        results[algo] = await hashText(text, algo);
      }
      setHashes(results);
    } finally {
      setLoading(false);
    }
  };

  const copy = (v: string, key: string) => {
    navigator.clipboard.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolShell title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text or file. 100% local.">
      <div className="space-y-4">
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">or upload a file:</label>
            <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {file ? file.name : "Choose file"}
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </label>
            {file && <button onClick={() => setFile(null)} className="text-xs text-red-400">✕</button>}
          </div>
        </div>

        <button onClick={generate} disabled={loading} className="btn-primary w-full">
          {loading ? "Computing..." : "Generate Hashes"}
        </button>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3">
            {algos.map(algo => (
              <div key={algo} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{algo}</span>
                  <button onClick={() => copy(hashes[algo], algo)} className="text-gray-400 hover:text-white transition-colors">
                    {copied === algo ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <code className="text-xs font-mono text-gray-300 break-all">{hashes[algo]}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
