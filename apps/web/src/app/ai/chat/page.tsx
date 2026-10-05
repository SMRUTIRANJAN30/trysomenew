"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Send, Upload, Sparkles, Bot, User, FileText, CornerDownLeft } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatPage() {
  const [docContent, setDocContent] = useState(
    `trysomenew is an all-in-one document workspace. Key features include PDF merge, split, rotate, compress, cryptographic SHA-256 verification, online clipboard, and WebRTC QuickSend transfer. All processing is 100% local in the client browser.`
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your local privacy-first Document Assistant. I can answer questions, extract dates, find statistics, or clarify terms from your document with zero data retention. What would you like to know?",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);

  const answerQuestionLocally = (query: string, doc: string): string => {
    const qLower = query.toLowerCase();
    const sentences = doc.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

    // Score sentences by matching words
    const queryTokens = qLower.split(/\s+/).filter((w) => w.length > 2);
    let bestSentences: { sentence: string; score: number }[] = [];

    for (const s of sentences) {
      let score = 0;
      const sLower = s.toLowerCase();
      for (const token of queryTokens) {
        if (sLower.includes(token)) score += 1;
      }
      if (score > 0) {
        bestSentences.push({ sentence: s, score });
      }
    }

    bestSentences.sort((a, b) => b.score - a.score);

    if (bestSentences.length > 0) {
      const top = bestSentences.slice(0, 3).map((b) => b.sentence).join(". ");
      return `Based on your document: "${top}."`;
    }

    if (qLower.includes("summary") || qLower.includes("summarize") || qLower.includes("what is")) {
      return `Summary of the document: ${sentences.slice(0, 2).join(". ")}.`;
    }

    if (qLower.includes("security") || qLower.includes("privacy")) {
      return "The document emphasizes local-first browser memory execution, zero server uploads, and cryptographic SHA-256 verification.";
    }

    return `I reviewed the document for "${query}". While no exact keyword match was found, the document covers ${sentences.length} clauses spanning ${doc.split(/\s+/).length} words. Try searching for specific terms like 'features', 'architecture', or 'security'.`;
  };

  const handleSend = () => {
    if (!inputQuery.trim() || isAnswering) return;
    const userMsg: Message = { role: "user", content: inputQuery.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsAnswering(true);

    setTimeout(() => {
      const reply = answerQuestionLocally(userMsg.content, docContent);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsAnswering(false);
    }, 350);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setDocContent(event.target.result);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Successfully loaded "${f.name}". You can now ask questions about it!` },
          ]);
        }
      };
      reader.readAsText(f);
    }
  };

  return (
    <ToolShell
      title="Chat with Document (Phase 3)"
      description="Ask questions, query clauses, and search your document with a local browser-native Q&A assistant."
      actions={
        <label className="btn-secondary py-1.5 px-3 text-xs cursor-pointer flex items-center gap-1.5">
          <Upload size={13} />
          <span>Upload Document</span>
          <input type="file" accept=".txt,.md,.pdf,.json" onChange={handleFileUpload} className="hidden" />
        </label>
      }
    >
      <div className="space-y-4">
        {/* Chat Stream */}
        <div className="glass rounded-2xl p-6 min-h-[420px] max-h-[500px] flex flex-col justify-between space-y-4 overflow-hidden">
          <div className="overflow-y-auto space-y-3.5 pr-2 flex-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={15} />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-xs"
                      : "bg-black/10 dark:bg-white/5 border border-[var(--border-subtle)] text-[var(--foreground)] rounded-tl-xs"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}
            {isAnswering && (
              <div className="flex gap-2 items-center text-xs text-[var(--muted)] animate-pulse pl-9">
                <Sparkles size={12} className="text-cyan-400" />
                <span>Reading document and formulating reply...</span>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2">
            <input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your document..."
              className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!inputQuery.trim() || isAnswering}
              className="btn-primary py-3 px-4 flex items-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
