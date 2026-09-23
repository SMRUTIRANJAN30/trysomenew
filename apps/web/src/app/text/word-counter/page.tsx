"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

function countWords(text: string) {
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.max(1, Math.ceil(words.length / 238));
  const speakingTime = Math.max(1, Math.ceil(words.length / 130));
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ""))).size;

  // Frequency
  const freq: Record<string, number> = {};
  for (const w of words) {
    const k = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (k.length > 2) freq[k] = (freq[k] ?? 0) + 1;
  }
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return { wordCount: words.length, charCount: text.length, charNoSpaces: text.replace(/\s/g, "").length, sentences, paragraphs, readingTime, speakingTime, uniqueWords, topWords };
}

export default function WordCounterPage() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This is a simple sentence to demonstrate the word counter. Start typing your own text below!\n\nThis is a second paragraph to show paragraph counting.");
  const stats = countWords(text);
  const [copied, setCopied] = useState(false);

  const Stat = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="glass rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );

  return (
    <ToolShell title="Word Counter" description="Real-time word, character, sentence, paragraph counting with reading time and word frequency.">
      <div className="space-y-5">
        <div className="relative">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-48 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Start typing or paste your text here..."
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-600">{stats.wordCount} words</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <Stat label="Words" value={stats.wordCount} />
          <Stat label="Characters" value={stats.charCount} />
          <Stat label="Chars (no spaces)" value={stats.charNoSpaces} />
          <Stat label="Sentences" value={stats.sentences} />
          <Stat label="Paragraphs" value={stats.paragraphs} />
          <Stat label="Unique Words" value={stats.uniqueWords} />
          <Stat label="Reading Time" value={`${stats.readingTime} min`} sub="@ 238 wpm" />
          <Stat label="Speaking Time" value={`${stats.speakingTime} min`} sub="@ 130 wpm" />
        </div>

        {stats.topWords.length > 0 && (
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Top Words</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topWords.map(([word, count]) => (
                <div key={word} className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                  <span className="text-sm text-blue-300">{word}</span>
                  <span className="text-xs text-blue-500 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
