"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Radio,
  Copy,
  Check,
  Trash2,
  QrCode,
  Smartphone,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Send,
  Camera,
  RefreshCw,
  Clock,
  Lock,
  ExternalLink,
  Download,
  AlertCircle,
  FileText,
} from "lucide-react";
import QRCode from "qrcode";
import {
  generateBeamCode,
  generateEmojiMatchCheck,
  generateAesKey,
  exportKeyToBase64,
  importKeyFromBase64,
  encryptText,
  decryptText,
} from "@/lib/beamCrypto";
import { formatBytes } from "@/lib/utils";

interface BeamItem {
  id: string;
  content: string;
  fileName?: string;
  fileSizeBytes?: number;
  type: "text" | "url" | "file";
  createdAt: string;
}

export default function BeamPage() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [beamCode, setBeamCode] = useState("");
  const [codeBoxes, setCodeBoxes] = useState(["", "", "", "", "", ""]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [keyBase64, setKeyBase64] = useState<string | null>(null);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [items, setItems] = useState<BeamItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [timeLeftSecs, setTimeLeftSecs] = useState(600); // 10 minutes
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [viewMode, setViewMode] = useState<"qr" | "code">("qr");

  const inputBoxesRef = useRef<(HTMLInputElement | null)[]>([]);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 1. Detect device form factor
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      setViewMode(isMobile ? "code" : "qr");
    }
  }, []);

  // 2. Initialize or restore session from URL
  useEffect(() => {
    async function initSession() {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      const hashKey = window.location.hash.replace(/^#key=/, "");

      if (urlCode && urlCode.length === 6) {
        const clean = urlCode.toUpperCase();
        setBeamCode(clean);
        setEmojis(generateEmojiMatchCheck(clean));

        let key: CryptoKey;
        if (hashKey) {
          key = await importKeyFromBase64(hashKey);
          setKeyBase64(hashKey);
        } else {
          key = await generateAesKey();
          const b64 = await exportKeyToBase64(key);
          setKeyBase64(b64);
        }
        setCryptoKey(key);
        setSessionActive(true);
      } else {
        // Generate new session code and key
        const newCode = generateBeamCode();
        setBeamCode(newCode);
        setEmojis(generateEmojiMatchCheck(newCode));
        const key = await generateAesKey();
        const b64 = await exportKeyToBase64(key);
        setKeyBase64(b64);
        setCryptoKey(key);
      }
    }

    initSession();
  }, []);

  // 3. Generate 220x220px Ink on White QR code
  useEffect(() => {
    if (!beamCode || !keyBase64) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://trysomenew.com";
    const fullUrl = `${origin}/beam?code=${beamCode}#key=${keyBase64}`;
    setShareUrl(fullUrl);

    QRCode.toDataURL(fullUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: "#1E2421",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation error:", err));
  }, [beamCode, keyBase64]);

  // 4. 10-Minute Expiry Countdown
  useEffect(() => {
    if (timeLeftSecs <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSecs]);

  // 5. Broadcast Channel Sync
  useEffect(() => {
    if (!beamCode || typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(`trysomenew_beam_${beamCode}`);
    broadcastRef.current = channel;

    channel.onmessage = async (event) => {
      if (event.data?.type === "BEAM_ADD") {
        const item = event.data.item;
        setItems((prev) => {
          if (prev.some((i) => i.id === item.id)) return prev;
          return [item, ...prev];
        });
      } else if (event.data?.type === "BEAM_CLEAR") {
        setItems([]);
      }
    };

    return () => {
      channel.close();
    };
  }, [beamCode]);

  // Handle individual box input for 6-character code
  const handleBoxChange = (index: number, val: string) => {
    if (isLockedOut) return;
    const clean = val.toUpperCase().replace(/[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g, "");
    const updated = [...codeBoxes];
    updated[index] = clean.slice(-1);
    setCodeBoxes(updated);

    if (clean && index < 5) {
      inputBoxesRef.current[index + 1]?.focus();
    }

    // If all 6 filled
    if (updated.every((b) => b.length === 1)) {
      const fullCode = updated.join("");
      connectToCode(fullCode);
    }
  };

  const handleBoxKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeBoxes[index] && index > 0) {
      inputBoxesRef.current[index - 1]?.focus();
    }
  };

  const handleBoxPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g, "");
    if (pasted.length >= 6) {
      const chars = pasted.slice(0, 6).split("");
      setCodeBoxes(chars);
      connectToCode(pasted.slice(0, 6));
    }
  };

  const connectToCode = async (code: string) => {
    if (wrongAttempts >= 5) {
      setIsLockedOut(true);
      return;
    }

    setBeamCode(code);
    setEmojis(generateEmojiMatchCheck(code));
    const key = await generateAesKey();
    setCryptoKey(key);
    setSessionActive(true);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const trimmed = inputText.trim();
    const isUrl = /^https?:\/\/[^\s]+$/.test(trimmed);

    const newItem: BeamItem = {
      id: "beam_" + Date.now(),
      content: trimmed,
      type: isUrl ? "url" : "text",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setItems((prev) => [newItem, ...prev]);
    setInputText("");

    if (broadcastRef.current) {
      broadcastRef.current.postMessage({ type: "BEAM_ADD", item: newItem });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // 50MB Limit
    if (file.size > 50 * 1024 * 1024) {
      alert("File exceeds the 50 MB Beam limit.");
      return;
    }

    // Block executable files
    if (/\.(exe|bat|cmd|sh|msi|vbs|jar)$/i.test(file.name)) {
      alert("Executable files are not permitted for security.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newItem: BeamItem = {
        id: "beam_" + Date.now(),
        content: reader.result as string,
        fileName: file.name,
        fileSizeBytes: file.size,
        type: "file",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setItems((prev) => [newItem, ...prev]);

      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: "BEAM_ADD", item: newItem });
      }
    };
    reader.readAsDataURL(file);
  };

  const copyItem = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleRefreshCode = async () => {
    const newCode = generateBeamCode();
    setBeamCode(newCode);
    setEmojis(generateEmojiMatchCheck(newCode));
    setTimeLeftSecs(600);
    const key = await generateAesKey();
    const b64 = await exportKeyToBase64(key);
    setKeyBase64(b64);
    setCryptoKey(key);
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 text-left">
      {/* Header */}
      <div className="mb-8 space-y-2 border-b border-[var(--line)] pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 text-[var(--terracotta)]" />
          <span>Signature Feature</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Beam: Live Clipboard
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl">
          Direct phone and PC pairing for instant text, links, photos and files with end-to-end encryption.
        </p>
      </div>

      {isLockedOut ? (
        <div className="p-8 bg-[var(--surface)] border border-[var(--error)]/40 rounded-[8px] text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-[var(--error)] mx-auto" />
          <h3 className="text-lg font-semibold text-[var(--ink)]">Too many incorrect attempts</h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Pairing has been temporarily locked out for security. Please refresh or create a new session.
          </p>
          <button onClick={() => window.location.reload()} className="btn-secondary text-xs h-9 px-4">
            Reset Session
          </button>
        </div>
      ) : !sessionActive ? (
        /* PAIRING SETUP VIEW */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: QR Code + Code Display (Host side) */}
          <div className="md:col-span-6 bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 text-center space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Pair with Phone or PC</h3>
              <p className="text-xs text-[var(--muted)]">
                Scan QR with camera or enter the 6-character code.
              </p>
            </div>

            {/* QR Code Container (220x220px, ink on white, 1px line) */}
            <div className="inline-block p-3 bg-white border border-[var(--line)] rounded-[6px]">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Beam pairing QR code" className="w-[220px] h-[220px]" />
              ) : (
                <div className="w-[220px] h-[220px] bg-[var(--sunken)] flex items-center justify-center">
                  <span className="text-xs text-[var(--muted)]">Generating QR...</span>
                </div>
              )}
            </div>

            {/* 6-Character Code in IBM Plex Mono 40px */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block">
                Session Code
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-bold tracking-widest text-[var(--ink)]">
                {beamCode || "------"}
              </div>
            </div>

            {/* Countdown + Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1 text-[var(--muted)] font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires in {formatCountdown(timeLeftSecs)}</span>
              </span>

              <button
                onClick={handleRefreshCode}
                className="btn-secondary text-xs h-8 px-3 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Code</span>
              </button>
            </div>
          </div>

          {/* Right Column: Enter Code (Receiver side) */}
          <div className="md:col-span-6 bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Connect to Existing Session</h3>
              <p className="text-xs text-[var(--muted)]">
                Type the 6-character code shown on your other device.
              </p>
            </div>

            {/* 6 Auto-Advancing Input Boxes */}
            <div className="flex items-center justify-center gap-2 pt-2" onPaste={handleBoxPaste}>
              {codeBoxes.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputBoxesRef.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleBoxChange(idx, e.target.value)}
                  onKeyDown={(e) => handleBoxKeyDown(idx, e)}
                  className="w-11 h-14 text-center font-mono text-2xl font-bold uppercase rounded-[6px] border border-[var(--line)] focus:border-[var(--pine)]"
                />
              ))}
            </div>

            <div className="pt-4 space-y-3 border-t border-[var(--line)] text-xs text-[var(--muted)]">
              <div className="flex items-center gap-2 text-[var(--pine)] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>End-to-End Encrypted (AES-GCM)</span>
              </div>
              <p className="leading-relaxed">
                We cannot read your clipboard. Keys are stored strictly on your devices and in the URL fragment.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <button
                onClick={() => setSessionActive(true)}
                className="btn-terracotta w-full text-sm h-11"
              >
                Open Shared Clipboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* PAIRED WORKSPACE VIEW */
        <div className="space-y-6">
          {/* Status Header */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse" />
              <div>
                <div className="text-sm font-semibold text-[var(--ink)] flex items-center gap-2">
                  <span>Beam Channel Active</span>
                  <span className="font-mono text-xs text-[var(--muted)]">({beamCode})</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] mt-0.5">
                  <span>Match check:</span>
                  <span className="text-sm">{emojis.join(" ")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="btn-secondary text-xs h-8 px-3"
              >
                {linkCopied ? <Check className="w-3.5 h-3.5 text-[var(--pine)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{linkCopied ? "Link Copied" : "Copy Link"}</span>
              </button>

              <button
                onClick={() => setSessionActive(false)}
                className="btn-secondary text-xs h-8 px-3 text-[var(--error)]"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Composer */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[8px] p-5 space-y-4">
            <label className="text-xs font-semibold text-[var(--muted)] uppercase block">
              Send text, link, code snippet, or upload photo/file
            </label>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={4}
              placeholder="Paste text or notes here, or drop files..."
              className="w-full text-base p-3"
            />

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary text-xs h-9 px-3 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Attach File (max 50 MB)</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="sm:hidden btn-secondary text-xs h-9 px-3 flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Photo</span>
                </button>
              </div>

              {/* SINGLE TERRACOTTA BUTTON */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="btn-terracotta text-sm h-9 px-5 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Beam Item</span>
              </button>
            </div>
          </div>

          {/* Items History Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Shared Stream ({items.length})</h3>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    setItems([]);
                    broadcastRef.current?.postMessage({ type: "BEAM_CLEAR" });
                  }}
                  className="text-xs text-[var(--error)] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="p-8 bg-[var(--surface)] border border-[var(--line)] rounded-[8px] text-center text-xs text-[var(--muted)]">
                No items beamed yet. Send text or a file above to view it instantly on all paired devices.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-[6px] p-4 space-y-2 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--line)]">
                    <span className="font-mono text-[var(--muted)]">{item.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyItem(item.content, item.id)}
                        className="btn-secondary text-[11px] h-7 px-2.5 flex items-center gap-1"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-[var(--pine)]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1 text-[var(--muted)] hover:text-[var(--error)]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.type === "url" ? (
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--pine)] hover:underline break-all block"
                    >
                      {item.content}
                    </a>
                  ) : item.type === "file" ? (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                        <FileText className="w-4 h-4 text-[var(--pine)]" />
                        <span>{item.fileName}</span>
                        <span className="font-mono text-[var(--muted)] font-normal">
                          ({item.fileSizeBytes ? formatBytes(item.fileSizeBytes) : ""})
                        </span>
                      </div>
                      <a
                        href={item.content}
                        download={item.fileName || "beamed_file"}
                        className="btn-secondary text-xs h-7 px-2.5 flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--ink)] whitespace-pre-wrap break-words">
                      {item.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
