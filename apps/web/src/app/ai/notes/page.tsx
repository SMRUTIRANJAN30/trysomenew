"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { BookOpen, Copy, Check, Upload, Sparkles, Download } from "lucide-react";

interface NoteSection {
  title: string;
  points: string[];
}

function generateNotes(text: string): NoteSection[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
  const sections: NoteSection[] = [];

  sections.push({
    title: "1. Core Summary & Subject Overview",
    points: [
      "Key theme: " + (paragraphs[0]?.slice(0, 150) || "Document overview and key principles") + "...",
      "Purpose: Synthesize critical concepts for rapid recall and exam revision.",
    ],
  });

  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 25);
  sections.push({
    title: "2. Key Definitions & Concepts",
    points: sentences.slice(1, 5).map((s) => s + "."),
  });

  sections.push({
    title: "3. Review Checklist & Exam Flash Points",
    points: [
      "Understand the primary architectural flows and components.",
      "Identify the key cryptographic and security assumptions.",
      "Review edge cases, limits, and practical examples.",
    ],
  });

  return sections;
}

export default function StudyNotesPage() {
  const [inputText, setInputText] = useState(
    `Cryptography in modern applications guarantees confidentiality, authenticity, and data integrity. SHA-256 is a standard cryptographic hash function that produces a 256-bit fixed-length output digest. Unlike symmetric encryption, hash functions are one-way and cannot be inverted. Digital signatures combine asymmetric key cryptography with hashing to verify that a document has not been altered.`
  );
  const [notes, setNotes] = useState<NoteSection[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    setNotes(generateNotes(inputText));
  };

  const copy = () => {
    if (!notes) return;
    const str = notes.map((s) => `${s.title}\n${s.points.map((p) => "• " + p).join("\n")}`).join("\n\n");
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="Study Notes & Cheat Sheet Generator (Phase 3)"
      description="Turn textbooks, research papers, or documentation into structured revision notes and study bullet points."
      actions={
        notes ? (
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy Study Notes"}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setNotes(null);
            }}
            placeholder="Paste syllabus, textbook chapter, or documentation..."
            className="w-full h-36 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none"
          />
          <button onClick={handleGenerate} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Sparkles size={16} /> Generate Revision Notes
          </button>
        </div>

        {notes && (
          <div className="space-y-4 animate-in fade-in">
            {notes.map((sec, i) => (
              <div key={i} className="glass rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">{sec.title}</h3>
                <ul className="space-y-2">
                  {sec.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs text-[var(--muted)] flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
