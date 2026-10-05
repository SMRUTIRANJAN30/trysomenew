"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Download, Upload, Search } from "lucide-react";

const SAMPLE_CSV = `ID,Document Name,Size,Status,SHA256
DOC-101,Q3_Financial_Audit.pdf,2.4 MB,Verified,a82f91bc34e0
DOC-102,Employment_Contract.pdf,850 KB,Verified,e3b0c44298fc
DOC-103,Patent_Application_Draft.pdf,5.1 MB,Pending,cf83e1357eef
DOC-104,NDA_Agreement_Final.pdf,1.2 MB,Verified,4b227777d4dd`;

export default function CsvViewerPage() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  // Parse CSV
  const parseRows = (text: string) => {
    return text
      .trim()
      .split("\n")
      .map((line) => line.split(",").map((cell) => cell.trim()));
  };

  const rows = parseRows(csvText);
  const headers = rows[0] || [];
  const bodyRows = rows.slice(1);

  const filteredBodyRows = bodyRows.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return row.some((cell) => cell.toLowerCase().includes(q));
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setCsvText(event.target.result);
        }
      };
      reader.readAsText(f);
    }
  };

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(csvText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="CSV Viewer & Table Inspector"
      description="Inspect, search, and edit CSV tabular data in a clean interactive table with zero server uploads."
      actions={
        <div className="flex gap-2">
          <label className="btn-secondary py-1.5 px-3 text-xs cursor-pointer flex items-center gap-1.5">
            <Upload size={13} />
            <span>Upload CSV</span>
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={downloadCsv} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
            <Download size={13} /> Download
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Table Search & Metrics */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table rows..."
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--foreground)]"
            />
          </div>
          <div className="text-xs text-[var(--muted)] flex gap-4">
            <span>Columns: <strong>{headers.length}</strong></span>
            <span>Rows: <strong>{filteredBodyRows.length}</strong></span>
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="glass rounded-2xl overflow-hidden border border-[var(--card-border)]">
          <div className="overflow-x-auto max-h-[440px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-black/10 dark:bg-white/5 sticky top-0 backdrop-blur-md border-b border-[var(--border-subtle)]">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="p-3 font-semibold text-[var(--foreground)] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                {filteredBodyRows.length > 0 ? (
                  filteredBodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-[var(--muted)] whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length || 1} className="p-8 text-center text-[var(--muted-text)]">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Raw CSV Editor */}
        <div className="glass rounded-2xl p-4 space-y-2">
          <label className="text-xs font-semibold text-[var(--foreground)]">Raw CSV Source</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full h-32 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 font-mono text-xs text-[var(--foreground)] resize-none"
          />
        </div>
      </div>
    </ToolShell>
  );
}
