"use client";

import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Mic, Square, Copy, Check, Download } from "lucide-react";

export default function AudioTranscribePage() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let current = "";
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + " ";
          }
          setTranscript(current.trim());
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="Speech to Text Transcriber (Phase 3)"
      description="Transcribe live speech and dictated audio into real-time text directly in your browser. Zero cloud retention."
      actions={
        transcript ? (
          <div className="flex gap-2">
            <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={download} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
              <Download size={13} /> Export .TXT
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-6">
        <div className="glass rounded-3xl p-8 flex flex-col items-center text-center space-y-6">
          <div
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isListening
                ? "bg-red-500 text-white shadow-xl shadow-red-500/40 animate-pulse scale-105"
                : "bg-blue-600 text-white hover:scale-105 shadow-xl shadow-blue-500/30"
            }`}
          >
            {isListening ? <Square size={28} /> : <Mic size={32} />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              {isListening ? "Listening & Transcribing..." : "Click Microphone to Start Dictating"}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              Realtime speech-to-text processing using native client-side speech engines.
            </p>
          </div>

          <div className="w-full">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your transcribed speech will appear here in real-time..."
              className="w-full h-48 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
