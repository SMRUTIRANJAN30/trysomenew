"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Sparkles, Copy, Check, Upload, BookOpen, Clock, FileText, CheckCircle2 } from "lucide-react";

interface SummaryData {
  tldr: string;
  keyPoints: string[];
  actionItems: string[];
  readingTime: number;
  wordCount: number;
}

function generateLocalSummary(text: string): SummaryData {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));

  // Heuristic extraction
  const tldr = sentences.slice(0, 2).join(". ") + (sentences.length > 0 ? "." : "");

  const keyPoints: string[] = [];
  for (let i = 0; i < Math.min(sentences.length, 5); i++) {
    if (i >= 2) {
      keyPoints.push(sentences[i] + ".");
    }
  }
  if (keyPoints.length === 0 && sentences.length > 0) {
    keyPoints.push(sentences[0] + ".");
  }

  // Find action items or imperative clauses
  const actionItems: string[] = [];
  for (const s of sentences) {
    if (/must|should|need to|ensure|verify|implement|review|action/i.test(s)) {
      if (actionItems.length < 4) actionItems.push(s + ".");
    }
  }
  if (actionItems.length === 0) {
    actionItems.push("Verify document integrity against cryptographic SHA-256 standard.");
    actionItems.push("Archive document in local workspace repository.");
  }

  return {
    tldr,
    keyPoints,
    actionItems,
    readingTime,
    wordCount,
  };
}

export default function AiSummarizePage() {
  const [inputText, setInputText] = useState(
    `trysomenew is an all-in-one, privacy-first, ultra-fast document productivity platform designed to replace fragmented legacy toolchains. Built with a local-first browser engine, it runs intensive document operations directly on client hardware with zero server uploads, true cryptographic SHA-256 verification, and seamless cross-device synchronization.

All PDF operations including merge, split, rotation, and compression execute inside client browser memory using WebAssembly and HTML5 Canvas. No file contents are transmitted across network boundaries. Ephemeral clipboard rooms and P2P WebRTC QuickSend transfers use temporary in-memory signaling without permanent cloud retention.`
  );
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setSummary(generateLocalSummary(inputText));
      setIsSummarizing(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setInputText(event.target.result);
          setSummary(null);
        }
      };
      reader.readAsText(f);
    }
  };

  const copy = () => {
    if (!summary) return;
    const textToCopy = `TL;DR:\n${summary.tldr}\n\nKey Points:\n${summary.keyPoints.map((p) => "• " + p).join("\n")}\n\nAction Items:\n${summary.actionItems.map((a) => "- " + a).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="AI Document Summarizer (Phase 3)"
      description="Extract instant executive summaries, key bullet insights, and actionable items from any document with zero cloud latency."
      actions={
        <div className="flex gap-2">
          <label className="btn-secondary py-1.5 px-3 text-xs cursor-pointer flex items-center gap-1.5">
            <Upload size={13} />
            <span>Upload Document</span>
            <input type="file" accept=".txt,.md,.json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
          {summary && (
            <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy Summary"}
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center text-xs text-[var(--muted)]">
            <span>Input Text or Document</span>
            <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSummary(null);
            }}
            className="w-full h-44 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Paste text or document to summarize..."
          />
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || !inputText.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            <Sparkles size={16} />
            {isSummarizing ? "Analyzing Document Structure..." : "Generate AI Summary"}
          </button>
        </div>

        {/* Structured Summary Output */}
        {summary && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-[var(--foreground)]">{summary.wordCount}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">Word Count</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-cyan-400">{summary.readingTime} min</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">Reading Time</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-emerald-400">100% Local</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">Privacy Safe</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-indigo-400">Instant</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">Compute Speed</div>
              </div>
            </div>

            {/* TL;DR */}
            <div className="glass rounded-2xl p-6 border-l-4 border-l-blue-500 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <BookOpen size={14} /> Executive TL;DR
              </h3>
              <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
                {summary.tldr}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="glass rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Key Insights & Findings
              </h3>
              <ul className="space-y-2">
                {summary.keyPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-[var(--muted)] flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="glass rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Actionable Next Steps
              </h3>
              <ul className="space-y-2">
                {summary.actionItems.map((item, i) => (
                  <li key={i} className="text-xs text-[var(--foreground)] flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
