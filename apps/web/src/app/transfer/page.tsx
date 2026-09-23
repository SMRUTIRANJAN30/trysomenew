"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  UploadCloud,
  FileText,
  QrCode,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  Share2,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatBytes } from "@/lib/utils";
import { ProcessingBadge } from "@/components/common/ProcessingBadge";

interface TransferFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "staged" | "transferring" | "complete";
}

export default function QuickSendTransferPage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [stagedFiles, setStagedFiles] = useState<TransferFile[]>([]);
  const [showQr, setShowQr] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    const existing = sessionStorage.getItem("trysomenew_transfer_room");
    if (existing) {
      setRoomCode(existing);
    } else {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem("trysomenew_transfer_room", generated);
      setRoomCode(generated);
    }
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: TransferFile[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: f.size,
      progress: 0,
      status: "staged",
    }));

    setStagedFiles((prev) => [...prev, ...newItems]);
  };

  const handleStartTransfer = () => {
    if (stagedFiles.length === 0) return;
    setIsTransferring(true);

    // Simulate P2P WebRTC data channel transfer
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setStagedFiles((prev) =>
          prev.map((f) => ({ ...f, progress: 100, status: "complete" }))
        );
        setIsTransferring(false);
        confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      } else {
        setStagedFiles((prev) =>
          prev.map((f) => ({
            ...f,
            progress: Math.min(100, current),
            status: "transferring",
          }))
        );
      }
    }, 250);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  QuickSend Cross-Device Transfer
                </h1>
                <span className="text-[10px] bg-cyan-500/15 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  P2P WEBRTC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Send files directly between browser sessions without uploading to cloud servers.
              </p>
            </div>
          </div>
        </div>

        {/* Room & QR Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Transfer Room:</span>
            <span className="text-cyan-400 font-mono font-bold tracking-wider text-sm">
              {roomCode}
            </span>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Scan QR to pair device"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* QR Pairing Drawer */}
      {showQr && (
        <div className="bg-[#0e1626] border border-cyan-500/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Connect Smartphone</span>
            </div>
            <h3 className="text-base font-bold text-white">Scan to Pair Room #{roomCode}</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Open your camera app to establish a secure peer-to-peer data channel directly with this browser.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
            <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
              <QrCode className="w-16 h-16 text-cyan-400" />
              <span className="text-[10px] font-mono mt-1 text-slate-400">#{roomCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Indicator */}
      <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">
            Signaling ready • Direct P2P Channel Ready
          </span>
        </div>
        <ProcessingBadge mode="local" />
      </div>

      {/* File Upload Drop Zone */}
      <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-3xl p-10 text-center flex flex-col items-center justify-center cursor-pointer bg-[#0e1626]/60 hover:bg-slate-900/60 transition-all group">
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="w-16 h-16 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white">
          Drop files to stage for transfer (up to 100 MB)
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          PDF, DOCX, Images, ZIP, and general documents. Zero permanent cloud storage.
        </p>
        <span className="mt-5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-cyan-500/20 transition-colors">
          Browse Files to Send
        </span>
      </label>

      {/* Staged Transfer Items */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              Staged for Transfer ({stagedFiles.length})
            </span>
            <button
              onClick={() => setStagedFiles([])}
              className="text-slate-500 hover:text-red-400"
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            {stagedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="font-semibold text-white truncate">{file.name}</span>
                    <span className="text-slate-500">({formatBytes(file.size)})</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.status === "complete" ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Transferred</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">{file.progress}%</span>
                    )}

                    <button
                      onClick={() => setStagedFiles((prev) => prev.filter((f) => f.id !== file.id))}
                      className="p-1 text-slate-500 hover:text-red-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {file.status === "transferring" && (
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-1.5 rounded-full transition-all duration-200"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartTransfer}
              disabled={isTransferring}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isTransferring ? "Streaming Bytes..." : "Send to Connected Device"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
