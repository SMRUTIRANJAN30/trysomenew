"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

// Minimal XML formatter
function formatXML(xml: string, indent: number): string {
  const tab = " ".repeat(indent);
  let formatted = "";
  let level = 0;
  const tokens = xml.match(/<[^>]+>|[^<>]+/g) ?? [];
  for (let tok of tokens) {
    tok = tok.trim();
    if (!tok) continue;
    if (tok.startsWith("</")) {
      level--;
      formatted += `${tab.repeat(level)}${tok}\n`;
    } else if (tok.startsWith("<") && !tok.endsWith("/>") && !tok.startsWith("<?") && !tok.startsWith("<!")) {
      formatted += `${tab.repeat(level)}${tok}\n`;
      level++;
    } else {
      formatted += `${tab.repeat(level)}${tok}\n`;
    }
  }
  return formatted.trim();
}

export default function XmlFormatterPage() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?><root><user id="1"><name>Alice</name><email>alice@example.com</email></user><user id="2"><name>Bob</name><email>bob@example.com</email></user></root>`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = () => {
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      const parseError = doc.querySelector("parseerror");
      if (parseError) throw new Error(parseError.textContent || "XML parse error");
      const serializer = new XMLSerializer();
      const serialized = serializer.serializeToString(doc);
      setOutput(formatXML(serialized, indent));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const minify = () => {
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      const parseError = doc.querySelector("parseerror");
      if (parseError) throw new Error(parseError.textContent || "XML parse error");
      const serializer = new XMLSerializer();
      setOutput(serializer.serializeToString(doc).replace(/\s+/g, " ").replace(/> </g, "><").trim());
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="XML Formatter & Validator" description="Beautify, minify, and validate XML documents using the browser's built-in XML parser.">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[2, 4].map(v => (
            <button key={v} onClick={() => setIndent(v)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors ${indent === v ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >{v} spaces</button>
          ))}
          <div className="ml-auto flex gap-2">
            <button onClick={format} className="btn-primary">Format</button>
            <button onClick={minify} className="btn-secondary">Minify</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            className="h-72 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Paste XML here..." />
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-gray-400">Output</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea readOnly value={output}
              className="h-72 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-200 resize-none focus:outline-none w-full" />
          </div>
        </div>
        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}
      </div>
    </ToolShell>
  );
}
