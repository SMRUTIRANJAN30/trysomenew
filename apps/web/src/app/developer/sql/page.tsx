"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Sparkles } from "lucide-react";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING",
  "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "ON",
  "AS", "IN", "IS NULL", "IS NOT NULL", "LIKE", "BETWEEN", "UNION", "ALL"
];

function formatSql(query: string): string {
  let clean = query.trim().replace(/\s+/g, " ");

  // Uppercase keywords
  for (const kw of KEYWORDS) {
    const reg = new RegExp(`\\b${kw}\\b`, "gi");
    clean = clean.replace(reg, kw);
  }

  // Insert line breaks before major clauses
  const majorClauses = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "UNION"
  ];

  for (const clause of majorClauses) {
    const reg = new RegExp(`\\s+(${clause})\\s+`, "g");
    clean = clean.replace(reg, "\n$1 ");
  }

  // Clean lines with indent for conditions
  const lines = clean.split("\n").map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("AND ") || trimmed.startsWith("OR ") || trimmed.startsWith("ON ")) {
      return "  " + trimmed;
    }
    return trimmed;
  });

  return lines.join("\n");
}

export default function SqlFormatterPage() {
  const [sql, setSql] = useState(
    `select u.id, u.name, count(d.id) as doc_count from users u left join documents d on u.id = d.user_id where u.active = 1 and d.created_at >= '2026-01-01' group by u.id, u.name order by doc_count desc limit 50;`
  );
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setSql(formatSql(sql));
  };

  const copy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="SQL Formatter & Beautifier"
      description="Format and standardize complex SQL queries with capitalized standard keywords and clean clause indentation."
      actions={
        <div className="flex gap-2">
          <button onClick={handleFormat} className="btn-primary flex items-center gap-1.5 text-xs py-2">
            <Sparkles size={14} /> Format SQL
          </button>
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="glass rounded-2xl p-4">
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="w-full min-h-[380px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Paste SQL query here..."
          />
        </div>
      </div>
    </ToolShell>
  );
}
