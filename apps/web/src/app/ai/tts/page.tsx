"use client";

import { useState, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Volume2, Play, Square, Pause, Sparkles } from "lucide-react";

export default function TextToSpeechPage() {
  const [text, setText] = useState(
    "Welcome to trysomenew, your private and ultra-fast workspace for documents, files, and devices. Everything runs directly on your local device."
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        if (available.length > 0 && !selectedVoice) {
          setSelectedVoice(available[0].name);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoice]);

  const speak = () => {
    if (!("speechSynthesis" in window) || !text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <ToolShell
      title="Text to Speech Synthesizer (Phase 3)"
      description="Convert any text or document into natural spoken audio directly in your browser. 100% free with zero API key requirement."
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 text-xs font-sans text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Type or paste text to speak..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[var(--border-subtle)]">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Voice Selection</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2 text-xs text-[var(--foreground)]"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                <span>Speed: {rate}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                <span>Pitch: {pitch}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            {!isSpeaking ? (
              <button
                onClick={speak}
                disabled={!text.trim()}
                className="btn-primary flex items-center gap-2 py-2.5 px-6 text-xs flex-1 justify-center disabled:opacity-50"
              >
                <Play size={14} /> Start Reading Aloud
              </button>
            ) : (
              <button
                onClick={stop}
                className="btn-primary flex items-center gap-2 py-2.5 px-6 text-xs flex-1 justify-center bg-red-600 hover:bg-red-500"
              >
                <Square size={14} /> Stop Speech
              </button>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
