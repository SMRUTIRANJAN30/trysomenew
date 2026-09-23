"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function UrlEncodePage() {
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en&emoji=🚀");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      setResult(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setResult("Error: Invalid input for decoding");
    }
  };

  const swap = () => {
    setInput(result);
    setResult("");
    setMode(m => m === "encode" ? "decode" : "encode");
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="URL Encoder / Decoder" description="Percent-encode URLs and query parameters, or decode encoded strings. Fully local.">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["encode", "decode"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${mode === m ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >{m}</button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full h-32 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Enter percent-encoded string to decode..."}
        />

        <div className="flex gap-2">
          <button onClick={process} className="btn-primary flex-1">
            {mode === "encode" ? "URL Encode" : "URL Decode"}
          </button>
          <button onClick={swap} className="btn-secondary" title="Swap">
            <RefreshCw size={16} />
          </button>
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Result</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly value={result}
              className="w-full h-32 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Reference */}
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Common Encodings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              [" ", "%20"], ["!", "%21"], ['"', "%22"], ["#", "%23"],
              ["$", "%24"], ["&", "%26"], ["'", "%27"], ["+", "%2B"],
              [",", "%2C"], ["/", "%2F"], [":", "%3A"], ["=", "%3D"],
              ["?", "%3F"], ["@", "%40"], ["[", "%5B"], ["]", "%5D"],
            ].map(([char, enc]) => (
              <div key={char} className="flex items-center gap-2 text-xs">
                <code className="text-yellow-300 w-8">{char}</code>
                <span className="text-gray-600">→</span>
                <code className="text-blue-400">{enc}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
