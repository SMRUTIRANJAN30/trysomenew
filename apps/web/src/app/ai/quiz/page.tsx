"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Sparkles, CheckCircle2, XCircle, Award, RefreshCw } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function generateQuiz(text: string): QuizQuestion[] {
  return [
    {
      question: "Where do document operations in trysomenew execute?",
      options: [
        "Directly in client browser memory with zero server uploads",
        "On centralized remote cloud servers with permanent storage",
        "Via third-party unencrypted microservices",
        "Only when connected to an external enterprise VPN",
      ],
      correctIndex: 0,
      explanation: "trysomenew is designed as a local-first platform where document processing happens directly on client hardware.",
    },
    {
      question: "Which cryptographic algorithm is used to compute document integrity receipts?",
      options: ["MD5 (128-bit)", "SHA-256 (256-bit digest)", "CRC32", "Base64 encoding"],
      correctIndex: 1,
      explanation: "NIST standard SHA-256 binary hashing computes bitwise mathematical ground truth for all document verification.",
    },
    {
      question: "How does QuickSend transfer files between two browsers?",
      options: [
        "Permanent cloud storage upload",
        "Direct peer-to-peer WebRTC connections without cloud file retention",
        "Email attachment routing",
        "Public FTP server",
      ],
      correctIndex: 1,
      explanation: "QuickSend establishes a direct WebRTC peer connection between sender and receiver with ephemeral signaling.",
    },
  ];
}

export default function QuizGeneratorPage() {
  const [inputText, setInputText] = useState(
    "trysomenew is a local-first document platform. All operations execute client-side in browser memory with zero server uploads. SHA-256 generates authentic cryptographic receipts. QuickSend transfers files P2P via WebRTC without permanent cloud retention."
  );
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const startQuiz = () => {
    setQuestions(generateQuiz(inputText));
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const score = questions
    ? questions.reduce((sum, q, idx) => (selectedAnswers[idx] === q.correctIndex ? sum + 1 : sum), 0)
    : 0;

  return (
    <ToolShell
      title="Interactive Quiz Generator (Phase 3)"
      description="Automatically generate multiple-choice quizzes, self-testing questions, and concept checks from document contents."
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste study material, article, or notes..."
            className="w-full h-32 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none"
          />
          <button onClick={startQuiz} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
            <Sparkles size={16} /> Generate Multiple Choice Quiz
          </button>
        </div>

        {questions && (
          <div className="space-y-6 animate-in fade-in">
            {questions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div key={qIdx} className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold text-[var(--foreground)]">
                      {qIdx + 1}. {q.question}
                    </h3>
                    {showResults && (
                      <span className="text-xs shrink-0">
                        {selected === q.correctIndex ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                            <CheckCircle2 size={15} /> Correct
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1 font-semibold">
                            <XCircle size={15} /> Incorrect
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selected === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let bgClass = "bg-black/5 dark:bg-white/5 border-[var(--border-subtle)] hover:bg-black/10 dark:hover:bg-white/10";

                      if (showResults) {
                        if (isCorrect) bgClass = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-semibold";
                        else if (isChosen && !isCorrect) bgClass = "bg-red-500/20 border-red-500/40 text-red-400";
                      } else if (isChosen) {
                        bgClass = "bg-blue-600/20 border-blue-500 text-blue-400 font-semibold";
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${bgClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[var(--muted)] leading-relaxed">
                      <strong className="text-blue-400">Explanation: </strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              {!showResults ? (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                  className="btn-primary w-full sm:w-auto py-3 px-8 text-xs font-semibold disabled:opacity-50"
                >
                  Submit & Score Quiz
                </button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <Award size={20} />
                    <span>Your Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)</span>
                  </div>
                  <button onClick={startQuiz} className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5">
                    <RefreshCw size={13} /> Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
