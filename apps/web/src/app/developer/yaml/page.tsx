"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, RefreshCw } from "lucide-react";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";

export default function YamlPage() {
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json" | "validate">("json-to-yaml");
  const [input, setInput] = useState(JSON.stringify({ name: "trysomenew", version: "1.0", features: ["pdf", "ai"] }, null, 2));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setOutput("");
    try {
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(yamlDump(parsed));
      } else if (mode === "yaml-to-json") {
        const parsed = yamlLoad(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        yamlLoad(input);
        setError("✅ Valid YAML");
      }
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { key: "json-to-yaml", label: "JSON → YAML" },
    { key: "yaml-to-json", label: "YAML → JSON" },
    { key: "validate", label: "Validate YAML" },
  ] as const;

  return (
    <ToolShell title="YAML Formatter & Converter" description="Convert between YAML and JSON, or validate YAML syntax. Fully local.">
      <div className="space-y-4">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setMode(t.key)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${mode === t.key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
            >{t.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Input</label>
              <span className="text-xs text-gray-600">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-72 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          {mode !== "validate" && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Output</label>
                <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <textarea
                readOnly value={output}
                className="w-full h-72 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none"
              />
            </div>
          )}
        </div>

        <button onClick={convert} className="btn-primary w-full">
          {mode === "validate" ? "Validate" : "Convert"}
        </button>

        {error && (
          <div className={`p-3 rounded-xl border text-sm ${error.startsWith("✅") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
            {error}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
