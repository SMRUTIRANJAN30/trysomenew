"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Trash2, RefreshCw } from "lucide-react";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isFile, setIsFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError("Invalid input for decoding — ensure the Base64 string is valid.");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setOutput(dataUrl.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="Base64 Encoder / Decoder" description="Encode text or files to Base64, or decode Base64 strings back to text. Fully browser-local.">
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${mode === m ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              {m}
            </button>
          ))}
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" checked={isFile} onChange={e => setIsFile(e.target.checked)} className="accent-blue-500" />
            <span className="text-sm text-gray-400">Encode a file</span>
          </label>
        </div>

        {isFile && mode === "encode" && (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors bg-white/5">
            <span className="text-sm text-gray-400">Click to select a file</span>
            <input type="file" className="hidden" onChange={handleFile} />
          </label>
        )}

        {(!isFile || mode === "decode") && (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
          />
        )}

        <div className="flex gap-2">
          <button onClick={process} className="btn-primary flex-1">
            {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
          </button>
          <button onClick={swap} className="btn-secondary" title="Swap input/output">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="btn-secondary text-red-400">
            <Trash2 size={16} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>
        )}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Result</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-40 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none"
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
