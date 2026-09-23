"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Trash2 } from "lucide-react";

// Simple CSV/JSON converters
function jsonToCSV(json: string): string {
  const data = JSON.parse(json);
  const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = [...new Set(arr.flatMap(r => Object.keys(r)))];
  const csvEscape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return s.includes(",") || s.includes("\n") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [headers.map(csvEscape).join(","), ...arr.map(row => headers.map(h => csvEscape(row[h])).join(","))];
  return rows.join("\n");
}

function csvToJSON(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";
  const parseLine = (line: string) => {
    const result: string[] = [];
    let inQ = false, cur = "";
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"' && !inQ) { inQ = true; continue; }
      if (c === '"' && inQ) { if (line[i+1] === '"') { cur += '"'; i++; } else { inQ = false; } continue; }
      if (c === "," && !inQ) { result.push(cur); cur = ""; continue; }
      cur += c;
    }
    result.push(cur);
    return result;
  };
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(line => {
    const values = parseLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
  return JSON.stringify(rows, null, 2);
}

export default function JsonCsvPage() {
  const [mode, setMode] = useState<"json-csv" | "csv-json">("json-csv");
  const [input, setInput] = useState(JSON.stringify([
    { name: "Alice", age: 30, city: "NYC" },
    { name: "Bob", age: 25, city: "LA" },
  ], null, 2));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    try {
      setOutput(mode === "json-csv" ? jsonToCSV(input) : csvToJSON(input));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const ext = mode === "json-csv" ? "csv" : "json";
    const mime = mode === "json-csv" ? "text/csv" : "application/json";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `converted.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell title="JSON ↔ CSV Converter" description="Convert JSON arrays to CSV spreadsheets or parse CSV back to JSON. Fully local.">
      <div className="space-y-4">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(["json-csv", "csv-json"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${mode === m ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
            >{m === "json-csv" ? "JSON → CSV" : "CSV → JSON"}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">{mode === "json-csv" ? "JSON Input" : "CSV Input"}</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-64 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">{mode === "json-csv" ? "CSV Output" : "JSON Output"}</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly value={output}
              className="w-full h-64 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none"
            />
          </div>
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

        <div className="flex gap-2">
          <button onClick={convert} className="btn-primary flex-1">Convert</button>
          {output && <button onClick={download} className="btn-secondary">⬇ Download</button>}
        </div>
      </div>
    </ToolShell>
  );
}
