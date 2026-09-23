"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, RefreshCw } from "lucide-react";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWord(rng: () => number) {
  return LOREM_WORDS[Math.floor(rng() * LOREM_WORDS.length)];
}

function makeSentence(wordCount: number, rng: () => number) {
  const words = Array.from({ length: wordCount }, () => randomWord(rng));
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateLorem(type: string, count: number): string {
  let seed = Date.now();
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  if (type === "words") return Array.from({ length: count }, () => randomWord(rng)).join(" ");
  if (type === "sentences") return Array.from({ length: count }, () => makeSentence(Math.floor(rng() * 8) + 8, rng)).join(" ");
  if (type === "paragraphs") {
    return Array.from({ length: count }, () => {
      const sentCount = Math.floor(rng() * 4) + 4;
      return Array.from({ length: sentCount }, () => makeSentence(Math.floor(rng() * 8) + 8, rng)).join(" ");
    }).join("\n\n");
  }
  return "";
}

export default function LoremPage() {
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generate = () => {
    let result = generateLorem(type, count);
    if (startWithLorem && type !== "words") {
      result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result.slice(result.indexOf(" ") + 1);
    }
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell title="Lorem Ipsum Generator" description="Generate placeholder text in words, sentences, or paragraphs. Fully local.">
      <div className="space-y-5">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm text-gray-400">Generate</span>
            <input
              type="number" min={1} max={100} value={count}
              onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-16 bg-[#0d1117] border border-white/10 rounded-lg px-2 py-1.5 text-sm text-center text-gray-200 focus:outline-none"
            />
            {(["words", "sentences", "paragraphs"] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 text-sm rounded-lg border capitalize transition-colors ${type === t ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
              >{t}</button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} className="accent-blue-500" />
            <span className="text-sm text-gray-300">Start with "Lorem ipsum..."</span>
          </label>

          <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2">
            <RefreshCw size={14} />Generate
          </button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">{output.split(" ").length} words · {output.length} chars</label>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {output}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
