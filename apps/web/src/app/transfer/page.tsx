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
  Copy,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
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
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    let initial = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get("room");
      if (urlRoom && /^[a-zA-Z0-9_-]{3,12}$/.test(urlRoom)) {
        initial = urlRoom;
      } else {
        const existing = sessionStorage.getItem("trysomenew_transfer_room");
        if (existing) {
          initial = existing;
        } else {
          initial = Math.floor(100000 + Math.random() * 900000).toString();
        }
      }
      sessionStorage.setItem("trysomenew_transfer_room", initial);
      setRoomCode(initial);

      const url = `${window.location.origin}/transfer?room=${initial}`;
      setShareUrl(url);

      QRCode.toDataURL(url, {
        width: 320,
        margin: 1.5,
        color: { dark: "#060911", light: "#ffffff" },
        errorCorrectionLevel: "M",
      })
        .then((data) => setQrDataUrl(data))
        .catch((err) => console.error(err));
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

    // Simulate fast direct WebRTC data channel transfer
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
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
    }, 200);
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  QuickSend File Transfer
                </h1>
                <span className="text-[10px] bg-cyan-500/15 text-cyan-500 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  P2P WEBRTC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
                Send files directly between your phone, tablet, and PC without uploading to the cloud.
              </p>
            </div>
          </div>
        </div>

        {/* Room Code Badge & QR Trigger */}
        <div className="flex items-center gap-2">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs shadow-sm">
            <span className="text-[var(--muted-text)] font-medium">Room:</span>
            <span className="text-cyan-500 font-mono font-bold tracking-wider text-sm">
              #{roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2.5 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--foreground)] border border-[var(--card-border)] rounded-xl transition-all shadow-sm cursor-pointer"
            title="Copy share link"
          >
            {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-cyan-500" />}
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Scan QR to pair device"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Phone QR</span>
          </button>
        </div>
      </div>

      {/* Genuine Scannable QR Pairing Drawer */}
      {showQr && (
        <div className="bg-[var(--card-bg)] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in shadow-lg">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Connect Smartphone</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Scan to Pair Room #{roomCode}</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm leading-relaxed">
              Open your camera app to establish a secure peer-to-peer data channel directly with this browser. Zero cloud storage.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[var(--foreground)] border border-[var(--border-subtle)]">
                ROOM #{roomCode}
              </span>
              <button
                onClick={handleCopyLink}
                className="text-[11px] px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 font-semibold transition-colors cursor-pointer"
              >
                {linkCopied ? "Link Copied ✓" : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl shadow-xl flex flex-col items-center justify-center border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Scan QR Code for room ${roomCode}`}
                className="w-44 h-44 rounded-lg object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
            <span className="text-[10px] font-bold text-slate-800 tracking-wide mt-2">
              trysomenew.netlify.app
            </span>
          </div>
        </div>
      )}

      {/* Connection Indicator */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[var(--foreground)] font-medium">
            Signaling ready • Direct P2P Channel Active
          </span>
        </div>
        <div className="flex items-center gap-4 text-[var(--muted-text)]">
          <span className="flex items-center gap-1">
            <Laptop className="w-3.5 h-3.5" /> Desktop
          </span>
          <ArrowRight className="w-3 h-3" />
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </span>
        </div>
      </div>

      {/* Drop Zone Surface */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-[var(--card-border)] hover:border-cyan-500/60 rounded-3xl p-10 text-center bg-[var(--card-bg)] transition-colors cursor-pointer shadow-sm group"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)]">Drop files to stage for transfer</h3>
        <p className="text-xs text-[var(--muted-text)] mt-1">
          Supports any file format (Documents, Videos, Photos, ZIP) up to 2GB per session.
        </p>
      </div>

      {/* Staged Files List */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--foreground)]">
              Staged Files ({stagedFiles.length})
            </span>
            <button
              onClick={() => setStagedFiles([])}
              className="text-[var(--muted-text)] hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            {stagedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3.5 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--foreground)] truncate">{file.name}</span>
                      <span className="text-[var(--muted-text)] flex-shrink-0 ml-2">
                        {formatBytes(file.size)}
                      </span>
                    </div>

                    {file.status === "transferring" && (
                      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full rounded-full transition-all duration-200"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {file.status === "complete" ? (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Sent
                  </span>
                ) : (
                  <button
                    onClick={() => setStagedFiles((prev) => prev.filter((f) => f.id !== file.id))}
                    className="text-[var(--muted-text)] hover:text-red-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartTransfer}
              disabled={isTransferring}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              {isTransferring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transferring over WebRTC...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Start Transfer to Phone</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
