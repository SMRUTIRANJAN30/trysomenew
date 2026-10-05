"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Sparkles, ArrowLeft, ArrowRight, RotateCw, Layers } from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

function generateFlashcards(text: string): Flashcard[] {
  return [
    {
      front: "What is SHA-256?",
      back: "A cryptographic hash algorithm published by NIST that generates a unique 256-bit fixed-length mathematical fingerprint from any byte stream.",
    },
    {
      front: "What is Local-First Computing?",
      back: "An architecture where user data is processed and stored on local devices first (via browser memory/WASM/IndexedDB) rather than cloud servers.",
    },
    {
      front: "How does WebRTC QuickSend operate?",
      back: "It uses browser-to-browser P2P data channels with DTLS/SRTP encryption to transfer files without permanent cloud retention.",
    },
    {
      front: "What are Magic Bytes in a file?",
      back: "The first few bytes of a file signature (e.g. '%PDF', 'PNG', 'MZ') that reveal its true binary MIME type regardless of file extension.",
    },
  ];
}

export default function FlashcardsPage() {
  const [inputText, setInputText] = useState(
    "SHA-256 generates a 256-bit mathematical digest. Local-first computing processes user documents directly in browser memory. QuickSend uses WebRTC P2P data channels for ephemeral transfers. Magic bytes determine the authentic binary format of documents."
  );
  const [cards, setCards] = useState<Flashcard[]>(generateFlashcards(""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < cards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : cards.length - 1));
  };

  return (
    <ToolShell
      title="Flashcard Study Deck (Phase 3)"
      description="Create interactive study decks and active recall flashcards directly from your documents."
    >
      <div className="space-y-8 flex flex-col items-center">
        {/* Flashcard Card with Flip Effect */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-xl h-72 rounded-3xl glass border border-[var(--card-border)] p-8 flex flex-col justify-between items-center text-center cursor-pointer select-none hover:border-blue-500/50 shadow-2xl transition-all duration-300 relative group"
        >
          <div className="flex justify-between items-center w-full text-xs text-[var(--muted)]">
            <span className="font-semibold uppercase tracking-wider text-cyan-400">
              {isFlipped ? "Answer / Definition" : "Question / Concept"}
            </span>
            <span className="font-mono">
              {currentIndex + 1} of {cards.length}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-lg sm:text-xl font-bold text-[var(--foreground)] leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-text)] group-hover:text-blue-400 transition-colors">
            <RotateCw size={13} />
            <span>Click card to flip</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-1.5">
            <ArrowLeft size={14} /> Previous
          </button>
          <button onClick={() => setIsFlipped(!isFlipped)} className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-1.5">
            <RotateCw size={14} /> Flip Card
          </button>
          <button onClick={handleNext} className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5">
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
