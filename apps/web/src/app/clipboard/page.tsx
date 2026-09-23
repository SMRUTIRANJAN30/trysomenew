"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  RefreshCw,
  Plus,
  Wifi,
  Radio,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import QRCode from "qrcode";

interface ClipboardItem {
  id: string;
  content: string;
  type: "text" | "url" | "code";
  createdAt: string;
}

export default function OnlineClipboardPage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [inputRoom, setInputRoom] = useState<string>("");
  const [isChangingRoom, setIsChangingRoom] = useState(false);
  const [items, setItems] = useState<ClipboardItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isOnline, setIsOnline] = useState(true);

  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Initialize room code from URL query param or storage
  useEffect(() => {
    let initialRoom = "";
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get("room");
      if (urlRoom && /^[a-zA-Z0-9_-]{3,12}$/.test(urlRoom)) {
        initialRoom = urlRoom;
      } else {
        const stored = sessionStorage.getItem("trysomenew_clip_room");
        if (stored) {
          initialRoom = stored;
        } else {
          initialRoom = Math.floor(100000 + Math.random() * 900000).toString();
        }
      }
      sessionStorage.setItem("trysomenew_clip_room", initialRoom);
      setRoomCode(initialRoom);
      setInputRoom(initialRoom);

      const fullUrl = `${window.location.origin}/clipboard?room=${initialRoom}`;
      setShareUrl(fullUrl);
    }
  }, []);

  // Generate genuine QR code whenever roomCode changes
  useEffect(() => {
    if (!roomCode) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://trysomenew.com";
    const fullUrl = `${origin}/clipboard?room=${roomCode}`;
    setShareUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: "#060911",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error:", err));
  }, [roomCode]);

  // Setup BroadcastChannel for instant local cross-tab sync
  useEffect(() => {
    if (!roomCode || typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(`trysomenew_clip_${roomCode}`);
    broadcastRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data?.type === "UPDATE_ITEMS" && Array.isArray(event.data.items)) {
        setItems(event.data.items);
      }
    };

    return () => {
      channel.close();
    };
  }, [roomCode]);

  // Fetch items from serverless API & LocalStorage
  const fetchRoomItems = useCallback(async (code: string) => {
    if (!code) return;
    try {
      setIsSyncing(true);
      const res = await fetch(`/api/clipboard?room=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setItems((prev) => {
            // Merge local and remote
            const idSet = new Set(data.items.map((i: ClipboardItem) => i.id));
            const merged = [...data.items];
            for (const item of prev) {
              if (!idSet.has(item.id)) {
                merged.push(item);
              }
            }
            return merged;
          });
        }
        setIsOnline(true);
      }
    } catch {
      // Fallback to local storage if API is unreachable
      setIsOnline(false);
      const stored = localStorage.getItem(`trysomenew_clip_data_${code}`);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {}
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Poll for remote updates every 3 seconds
  useEffect(() => {
    if (!roomCode) return;
    fetchRoomItems(roomCode);

    const interval = setInterval(() => {
      fetchRoomItems(roomCode);
    }, 3000);

    return () => clearInterval(interval);
  }, [roomCode, fetchRoomItems]);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (roomCode && items.length > 0) {
      localStorage.setItem(`trysomenew_clip_data_${roomCode}`, JSON.stringify(items));
    }
  }, [roomCode, items]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !roomCode) return;

    let type: ClipboardItem["type"] = "text";
    const trimmed = inputText.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      type = "url";
    } else if (trimmed.includes("{") || trimmed.includes(";") || trimmed.includes("const ") || trimmed.includes("function")) {
      type = "code";
    }

    const newItem: ClipboardItem = {
      id: Math.random().toString(36).substring(2, 9),
      content: trimmed,
      type,
      createdAt: new Date().toLocaleTimeString(),
    };

    const nextItems = [newItem, ...items];
    setItems(nextItems);
    setInputText("");

    // Broadcast locally
    broadcastRef.current?.postMessage({
      type: "UPDATE_ITEMS",
      items: nextItems,
    });

    // Post to Serverless Endpoint for cross-device sync
    try {
      await fetch("/api/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomCode,
          item: newItem,
        }),
      });
    } catch (err) {
      console.warn("Offline sync fallback active:", err);
    }

    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  const handleCopy = (item: ClipboardItem) => {
    navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = async (id: string) => {
    const nextItems = items.filter((i) => i.id !== id);
    setItems(nextItems);

    broadcastRef.current?.postMessage({
      type: "UPDATE_ITEMS",
      items: nextItems,
    });

    try {
      await fetch(`/api/clipboard?room=${encodeURIComponent(roomCode)}&itemId=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {}
  };

  const handleClearAll = async () => {
    setItems([]);
    broadcastRef.current?.postMessage({
      type: "UPDATE_ITEMS",
      items: [],
    });
    localStorage.removeItem(`trysomenew_clip_data_${roomCode}`);

    try {
      await fetch(`/api/clipboard?room=${encodeURIComponent(roomCode)}`, {
        method: "DELETE",
      });
    } catch {}
  };

  const handleSwitchRoom = (newCode: string) => {
    const sanitized = newCode.trim().toUpperCase();
    if (!sanitized) return;
    setRoomCode(sanitized);
    sessionStorage.setItem("trysomenew_clip_room", sanitized);
    setIsChangingRoom(false);
    setItems([]);
    if (typeof window !== "undefined") {
      const newUrl = `${window.location.pathname}?room=${sanitized}`;
      window.history.replaceState(null, "", newUrl);
    }
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shadow-sm">
              <ClipboardCopy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                  Universal Clipboard
                </h1>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-500 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>SYNC ACTIVE</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-0.5">
                Real-time clipboard synchronization across your phone, tablet, and PC.
              </p>
            </div>
          </div>
        </div>

        {/* Room Controls & QR Launcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Room Badge */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs shadow-sm">
            <span className="text-[var(--muted-text)] font-medium">Room:</span>
            <span className="text-blue-500 font-mono font-bold tracking-wider text-sm">
              #{roomCode}
            </span>
            <button
              onClick={() => setIsChangingRoom(!isChangingRoom)}
              className="text-[10px] text-[var(--muted)] hover:text-blue-500 underline ml-1 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Copy Direct Link */}
          <button
            onClick={handleCopyLink}
            className="p-2.5 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--foreground)] border border-[var(--card-border)] rounded-xl transition-all shadow-sm cursor-pointer"
            title="Copy direct share link"
          >
            {linkCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-blue-500" />}
          </button>

          {/* Scannable QR Code Trigger */}
          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Scan QR Code to join from Phone"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Phone QR</span>
          </button>
        </div>
      </div>

      {/* Switch Room Input Drawer */}
      {isChangingRoom && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in shadow-sm">
          <span className="text-xs text-[var(--foreground)] font-semibold">Join Existing Room:</span>
          <input
            type="text"
            value={inputRoom}
            onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
            placeholder="e.g. 849201"
            className="bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-3 py-1.5 text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-blue-500 flex-1 w-full sm:w-auto"
          />
          <button
            onClick={() => handleSwitchRoom(inputRoom)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Join Room
          </button>
          <button
            onClick={() => {
              const fresh = Math.floor(100000 + Math.random() * 900000).toString();
              handleSwitchRoom(fresh);
            }}
            className="px-3 py-1.5 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] border border-[var(--border-subtle)] text-[var(--foreground)] text-xs rounded-xl cursor-pointer"
          >
            Generate New Room
          </button>
        </div>
      )}

      {/* Genuine Scannable QR Code Modal */}
      {showQr && (
        <div className="bg-[var(--card-bg)] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in shadow-lg">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold">
              <Smartphone className="w-4 h-4" />
              <span>Instant Mobile Pairing</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Scan with your Phone Camera</h3>
            <p className="text-xs text-[var(--muted)] max-w-sm leading-relaxed">
              Open your iPhone or Android camera app and point it at this QR code. It will instantly open this exact clipboard room on your phone with zero login required.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-[var(--foreground)] border border-[var(--border-subtle)]">
                ROOM #{roomCode}
              </span>
              <button
                onClick={handleCopyLink}
                className="text-[11px] px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-semibold transition-colors cursor-pointer"
              >
                {linkCopied ? "Link Copied ✓" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Real Scannable QR Code Image */}
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

      {/* Input Form for New Items */}
      <form onSubmit={handleAddItem} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
        <label className="block text-xs font-semibold text-[var(--foreground)]">
          Paste text, code snippets, or URLs to sync across your devices:
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type text here (e.g. passwords, addresses, code snippets, website links)..."
          className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl p-3 text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-blue-500 transition-colors"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-[11px] text-[var(--muted-text)]">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Encrypted in-transit • Auto-expires after 24h</span>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send to All Devices</span>
          </button>
        </div>
      </form>

      {/* Clipboard Items Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[var(--muted-text)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--foreground)]">Shared Feed ({items.length})</span>
            {isSyncing && <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />}
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[var(--muted-text)] hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear Room Feed
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-2xl p-12 text-center text-[var(--muted-text)] text-xs space-y-2">
            <ClipboardCopy className="w-8 h-8 text-[var(--muted)] mx-auto opacity-50 mb-2" />
            <p className="font-medium text-[var(--foreground)]">No items in this clipboard room yet.</p>
            <p>Paste text above or scan the QR code from your phone to share text instantly!</p>
          </div>
        ) : (
          items.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group hover:border-blue-500/40 transition-all shadow-sm"
              >
                <div className="min-w-0 space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-[var(--muted-text)] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--foreground)] font-semibold uppercase border border-[var(--border-subtle)]">
                      {item.type}
                    </span>
                    <span>{item.createdAt}</span>
                    {item.type === "url" && (
                      <a
                        href={item.content}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-0.5 ml-1"
                      >
                        <span>Open link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--foreground)] font-mono break-all whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[var(--foreground)] border border-[var(--border-subtle)] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-[var(--muted-text)] hover:text-red-500 rounded transition-colors cursor-pointer"
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
