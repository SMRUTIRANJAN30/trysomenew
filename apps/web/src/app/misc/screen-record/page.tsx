"use client";

import { useState, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Video, Mic, Download, Play, Square, Pause, ShieldCheck } from "lucide-react";

export default function ScreenRecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordAudio, setRecordAudio] = useState(true);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: recordAudio,
      });

      let combinedStream = displayStream;

      if (recordAudio) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = [...displayStream.getAudioTracks(), ...micStream.getAudioTracks()];
          combinedStream = new MediaStream([...displayStream.getVideoTracks(), ...audioTracks]);
        } catch {
          // If mic permission denied, continue with display stream
        }
      }

      streamRef.current = combinedStream;

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        setRecordedUrl(URL.createObjectURL(blob));
        setIsRecording(false);
        setIsPaused(false);
        clearInterval(timerIntervalRef.current);
      };

      // Handle user clicking native "Stop sharing" bar
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordedUrl(null);
      setTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    clearInterval(timerIntervalRef.current);
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <ToolShell
      title="Browser Screen Recorder (Phase 3)"
      description="Record your screen, browser window, or active tab with audio directly in your browser. 100% private with zero cloud recording."
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="glass rounded-3xl p-8 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Video size={32} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              {isRecording ? "Recording in Progress..." : "Ready to Record Screen"}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1 max-w-md">
              Capture tutorials, presentations, or bug reports with zero external software installation.
            </p>
          </div>

          {/* Timer Display */}
          <div className="font-mono text-3xl font-extrabold text-[var(--foreground)] flex items-center gap-3">
            {isRecording && <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />}
            <span>{formatTime(timer)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="btn-primary flex items-center gap-2 py-3 px-6 text-sm font-semibold shadow-lg shadow-blue-500/20"
              >
                <Play size={16} /> Start Screen Recording
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="btn-secondary flex items-center gap-2 py-3 px-5 text-sm font-semibold"
                >
                  <Pause size={16} /> {isPaused ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={stopRecording}
                  className="btn-primary flex items-center gap-2 py-3 px-6 text-sm font-semibold bg-red-600 hover:bg-red-500"
                >
                  <Square size={16} /> Finish Recording
                </button>
              </>
            )}
          </div>

          {/* Audio Toggle */}
          {!isRecording && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--muted)] select-none">
              <input
                type="checkbox"
                checked={recordAudio}
                onChange={(e) => setRecordAudio(e.target.checked)}
                className="rounded border-[var(--input-border)] text-blue-600"
              />
              <Mic size={14} /> Include microphone & tab audio
            </label>
          )}
        </div>

        {/* Video Preview & Download */}
        {recordedUrl && (
          <div className="glass rounded-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <span className="text-sm font-semibold text-[var(--foreground)]">Recording Ready</span>
              <a
                href={recordedUrl}
                download={`screen-record-${new Date().toISOString().slice(0, 10)}.webm`}
                className="btn-primary flex items-center gap-2 text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500"
              >
                <Download size={14} /> Download Video (.webm)
              </a>
            </div>

            <div className="rounded-xl overflow-hidden bg-black/40 border border-[var(--border-subtle)]">
              <video src={recordedUrl} controls className="w-full max-h-[420px]" />
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
