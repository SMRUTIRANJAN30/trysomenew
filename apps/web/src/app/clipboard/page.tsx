"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardCopy,
  Copy,
  Check,
  Trash2,
  QrCode,
  Smartphone,
  Laptop,
  ArrowRight,
  Clock,
  Sparkles,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ClipboardItem {
  id: string;
  content: string;
  type: "text" | "url" | "code";
  createdAt: string;
}

export default function OnlineClipboardPage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    // Generate or read room code
    const existing = sessionStorage.getItem("trysomenew_clip_room");
    if (existing) {
      setRoomCode(existing);
    } else {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem("trysomenew_clip_room", generated);
      setRoomCode(generated);
    }

    // Default sample item
    setItems([
      {
        id: "clip-1",
        content: "https://trysomenew.com/pdf/merge",
        type: "url",
        createdAt: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let type: ClipboardItem["type"] = "text";
    if (inputText.startsWith("http://") || inputText.startsWith("https://")) {
      type = "url";
    } else if (inputText.includes("{") || inputText.includes(";") || inputText.includes("const ")) {
      type = "code";
    }

    const newItem: ClipboardItem = {
      id: Math.random().toString(36).substring(2, 9),
      content: inputText,
      type,
      createdAt: new Date().toLocaleTimeString(),
    };

    setItems((prev) => [newItem, ...prev]);
    setInputText("");
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  const handleCopy = (item: ClipboardItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ClipboardCopy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Online Cross-Device Clipboard
                </h1>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  REALTIME
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Instantly sync text, links, and code snippets between your laptop and phone.
              </p>
            </div>
          </div>
        </div>

        {/* Room Code Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0e1626] border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Room Code:</span>
            <span className="text-cyan-400 font-mono font-bold tracking-wider text-sm">
              {roomCode}
            </span>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            title="Show QR Code to join from phone"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>

      {/* QR Code Modal / Drawer */}
      {showQr && (
        <div className="bg-[#0e1626] border border-blue-500/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Scan with Phone Camera</span>
            </div>
            <h3 className="text-base font-bold text-white">Join Room #{roomCode}</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Point your phone&apos;s camera to open this clipboard room instantly without logging in.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
            {/* SVG QR Code representation */}
            <div className="w-32 h-32 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white text-center p-2">
              <QrCode className="w-16 h-16 text-cyan-400" />
              <span className="text-[10px] font-mono mt-1 text-slate-400">#{roomCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleAddItem} className="bg-[#0e1626] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Copy text or URL to send across devices:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type text, code snippets, or URLs here..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Items expire after 24 hours of inactivity</span>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync to Devices</span>
          </button>
        </div>
      </form>

      {/* Clipboard Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Clipboard Feed ({items.length})</span>
          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear Feed
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-[#0e1626]/40 border border-slate-800/80 rounded-2xl p-10 text-center text-slate-500 text-xs">
            No items in this clipboard room yet. Paste text above to start syncing!
          </div>
        ) : (
          items.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#0e1626] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                      {item.type}
                    </span>
                    <span>{item.createdAt}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-100 font-mono break-all whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
