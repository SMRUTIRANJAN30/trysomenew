"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DataConnection, Peer as PeerType } from "peerjs";
import QRCode from "qrcode";
import { Check, Copy, Download, FileUp, Link2, Loader2, Radio, Send, Smartphone, Wifi, WifiOff, X } from "lucide-react";

/**
 * Beam — real phone ↔ PC transfer over WebRTC.
 * A public PeerJS broker is used only for the pairing handshake; text and files then
 * travel directly between the two browsers on an encrypted (DTLS) data channel.
 */

const ID_PREFIX = "trysomenew-beam-";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
const CHUNK = 64 * 1024;
const MAX_BUFFER = 4 * 1024 * 1024;

type Status = "starting" | "waiting" | "connecting" | "connected" | "error";

type Item =
  | { id: string; kind: "text"; from: "me" | "peer"; text: string; at: number }
  | { id: string; kind: "file"; from: "me" | "peer"; name: string; size: number; mime: string; progress: number; url?: string; at: number };

type Ctrl =
  | { t: "text"; id: string; text: string }
  | { t: "file-start"; id: string; name: string; size: number; mime: string }
  | { t: "file-end"; id: string }
  | { t: "hello"; device: string };

function makeCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function deviceName() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad/.test(ua)) return "iPhone / iPad";
  if (/Android/.test(ua)) return "Android phone";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "Device";
}

const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

export default function BeamPage() {
  const [status, setStatus] = useState<Status>("starting");
  const [error, setError] = useState("");
  const [myCode, setMyCode] = useState("");
  const [qr, setQr] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [peerDevice, setPeerDevice] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const peerRef = useRef<PeerType | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const incoming = useRef<Map<string, { chunks: ArrayBuffer[]; received: number; size: number; mime: string; name: string }>>(new Map());
  const currentIncoming = useRef<string | null>(null);
  const sendQueue = useRef<Promise<void>>(Promise.resolve());
  const fileInput = useRef<HTMLInputElement>(null);

  const patchItem = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? ({ ...it, ...patch } as Item) : it)));
  }, []);

  const handleData = useCallback(
    (data: unknown) => {
      if (typeof data === "string") {
        let msg: Ctrl;
        try { msg = JSON.parse(data); } catch { return; }
        if (msg.t === "hello") setPeerDevice(msg.device);
        if (msg.t === "text") setItems((p) => [{ id: msg.id, kind: "text", from: "peer", text: msg.text, at: Date.now() }, ...p]);
        if (msg.t === "file-start") {
          incoming.current.set(msg.id, { chunks: [], received: 0, size: msg.size, mime: msg.mime, name: msg.name });
          currentIncoming.current = msg.id;
          setItems((p) => [{ id: msg.id, kind: "file", from: "peer", name: msg.name, size: msg.size, mime: msg.mime, progress: 0, at: Date.now() }, ...p]);
        }
        if (msg.t === "file-end") {
          const f = incoming.current.get(msg.id);
          if (!f) return;
          const url = URL.createObjectURL(new Blob(f.chunks, { type: f.mime || "application/octet-stream" }));
          incoming.current.delete(msg.id);
          currentIncoming.current = null;
          patchItem(msg.id, { progress: 100, url });
        }
        return;
      }
      // Binary chunk for the file currently being received (the channel is ordered).
      const id = currentIncoming.current;
      if (!id) return;
      const f = incoming.current.get(id);
      if (!f) return;
      // Some browsers hand us a typed-array view; copy it so offsets are respected.
      const buf = data instanceof ArrayBuffer ? data : ((data as Uint8Array).slice().buffer as ArrayBuffer);
      f.chunks.push(buf);
      f.received += buf.byteLength;
      const pct = f.size ? Math.min(99, Math.floor((f.received / f.size) * 100)) : 99;
      if (pct % 2 === 0) patchItem(id, { progress: pct });
    },
    [patchItem],
  );

  const attach = useCallback(
    (conn: DataConnection) => {
      connRef.current?.close();
      connRef.current = conn;
      setStatus("connecting");
      conn.on("open", () => {
        setStatus("connected");
        setError("");
        conn.send(JSON.stringify({ t: "hello", device: deviceName() } satisfies Ctrl));
      });
      conn.on("data", handleData);
      conn.on("close", () => {
        if (connRef.current === conn) {
          connRef.current = null;
          setPeerDevice("");
          setStatus("waiting");
        }
      });
      conn.on("error", (e) => setError(e.message));
    },
    [handleData],
  );

  // Create our peer (and auto-join if opened from a QR link).
  useEffect(() => {
    let cancelled = false;
    let peer: PeerType | null = null;

    (async () => {
      const { default: Peer } = await import("peerjs");
      const start = (attempt = 0) => {
        const code = makeCode();
        peer = new Peer(ID_PREFIX + code, { debug: 0 });
        peerRef.current = peer;
        peer.on("open", () => {
          if (cancelled) return;
          setMyCode(code);
          setStatus((s) => (s === "connected" || s === "connecting" ? s : "waiting"));
          const join = new URLSearchParams(window.location.search).get("join");
          if (join) {
            const target = join.toUpperCase().replace(/[^A-Z0-9]/g, "");
            setJoinCode(target);
            attach(peer!.connect(ID_PREFIX + target, { reliable: true, serialization: "raw" }));
            window.history.replaceState(null, "", "/beam");
          }
        });
        peer.on("connection", (conn) => attach(conn));
        peer.on("disconnected", () => { if (!cancelled && !peer?.destroyed) peer?.reconnect(); });
        peer.on("error", (e: Error & { type?: string }) => {
          if (cancelled) return;
          if (e.type === "unavailable-id" && attempt < 3) { peer?.destroy(); start(attempt + 1); return; }
          if (e.type === "peer-unavailable") {
            setError("No device is waiting with that code. Check the code and make sure Beam is open on the other device.");
            setStatus("waiting");
            return;
          }
          if (e.type === "network" || e.type === "server-error" || e.type === "socket-error") {
            setError("Can't reach the pairing server. Check your internet connection and reload.");
            setStatus("error");
            return;
          }
          setError(e.message);
        });
      };
      start();
    })().catch((e) => { setError(String(e)); setStatus("error"); });

    return () => {
      cancelled = true;
      connRef.current?.close();
      peer?.destroy();
    };
  }, [attach]);

  useEffect(() => {
    if (!myCode) return;
    QRCode.toDataURL(`${window.location.origin}/beam?join=${myCode}`, { width: 240, margin: 1, errorCorrectionLevel: "M" })
      .then(setQr)
      .catch(() => setQr(""));
  }, [myCode]);

  const connectTo = () => {
    const code = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length !== 6) { setError("Codes are 6 characters long."); return; }
    if (code === myCode) { setError("That's this device's own code — enter the code shown on the other device."); return; }
    if (!peerRef.current) return;
    setError("");
    attach(peerRef.current.connect(ID_PREFIX + code, { reliable: true, serialization: "raw" }));
  };

  const sendText = () => {
    const conn = connRef.current;
    const value = text.trim();
    if (!conn?.open || !value) return;
    const id = crypto.randomUUID();
    conn.send(JSON.stringify({ t: "text", id, text: value } satisfies Ctrl));
    setItems((p) => [{ id, kind: "text", from: "me", text: value, at: Date.now() }, ...p]);
    setText("");
  };

  const waitForBuffer = (conn: DataConnection) =>
    new Promise<void>((resolve) => {
      const dc = conn.dataChannel;
      if (!dc || dc.bufferedAmount < MAX_BUFFER) return resolve();
      dc.bufferedAmountLowThreshold = MAX_BUFFER / 2;
      const done = () => { dc.removeEventListener("bufferedamountlow", done); resolve(); };
      dc.addEventListener("bufferedamountlow", done);
    });

  const sendFile = (file: File) => {
    const id = crypto.randomUUID();
    setItems((p) => [{ id, kind: "file", from: "me", name: file.name, size: file.size, mime: file.type, progress: 0, at: Date.now() }, ...p]);
    // Files go one at a time so chunks never interleave.
    sendQueue.current = sendQueue.current.then(async () => {
      const conn = connRef.current;
      if (!conn?.open) { setError("Connection lost before the file could be sent."); return; }
      conn.send(JSON.stringify({ t: "file-start", id, name: file.name, size: file.size, mime: file.type } satisfies Ctrl));
      let offset = 0;
      let lastPct = -1;
      while (offset < file.size) {
        await waitForBuffer(conn);
        const buf = await file.slice(offset, offset + CHUNK).arrayBuffer();
        conn.send(buf);
        offset += buf.byteLength;
        const pct = Math.floor((offset / file.size) * 100);
        if (pct !== lastPct) { lastPct = pct; patchItem(id, { progress: pct }); }
      }
      conn.send(JSON.stringify({ t: "file-end", id } satisfies Ctrl));
      patchItem(id, { progress: 100 });
    });
  };

  const sendFiles = (files: FileList | File[] | null) => {
    if (!files || !connRef.current?.open) return;
    Array.from(files).forEach(sendFile);
  };

  const copy = async (id: string, value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(id); setTimeout(() => setCopied(null), 1500); } catch { /* ignore */ }
  };

  const disconnect = () => { connRef.current?.close(); connRef.current = null; setPeerDevice(""); setStatus("waiting"); };

  const connected = status === "connected";

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[var(--pine-tint)] text-[var(--pine)] text-xs font-semibold">
          <Radio className="w-3.5 h-3.5" /> Peer-to-peer · nothing is uploaded
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--ink)]">Beam — Send Text &amp; Files Between Phone and PC</h1>
        <p className="text-sm text-[var(--muted)] max-w-2xl">
          Open this page on both devices, scan the QR code with your phone, and send text, links, photos or any file in either direction.
          Data goes straight from one browser to the other over an encrypted WebRTC connection.
        </p>
      </header>

      {/* Status bar */}
      <div className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${connected ? "border-[var(--success)] bg-[var(--success-tint)]" : "border-[var(--line)] bg-[var(--surface)]"}`}>
        <div className="flex items-center gap-2 text-[var(--ink)]">
          {connected ? <Wifi className="w-4 h-4 text-[var(--success)]" /> : status === "error" ? <WifiOff className="w-4 h-4 text-[var(--error)]" /> : <Loader2 className="w-4 h-4 animate-spin text-[var(--muted)]" />}
          <span>
            {status === "starting" && "Starting…"}
            {status === "waiting" && "Waiting for another device"}
            {status === "connecting" && "Connecting…"}
            {status === "connected" && `Connected to ${peerDevice || "device"}`}
            {status === "error" && "Offline"}
          </span>
        </div>
        {connected && (
          <button onClick={disconnect} className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--error)]">
            <X className="w-3.5 h-3.5" /> Disconnect
          </button>
        )}
      </div>

      {error && <div role="alert" className="rounded-lg border border-[var(--error)] bg-[var(--error-tint)] px-4 py-3 text-sm text-[var(--error)]">{error}</div>}

      {!connected && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 flex flex-col items-center text-center gap-3">
            <h2 className="font-semibold text-[var(--ink)]">Scan with your other device</h2>
            <div className="w-[200px] h-[200px] rounded-lg bg-white p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {qr ? <img src={qr} alt="QR code to pair with Beam" width={184} height={184} /> : <Loader2 className="w-6 h-6 animate-spin text-gray-400" />}
            </div>
            <p className="text-xs text-[var(--muted)]">or enter this code on it</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl tracking-[0.3em] font-semibold text-[var(--ink)]">{myCode || "······"}</span>
              {myCode && (
                <button onClick={() => copy("code", myCode)} aria-label="Copy code" className="p-1.5 rounded hover:bg-[var(--sunken)] text-[var(--muted)]">
                  {copied === "code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-[var(--ink)] flex items-center gap-2"><Smartphone className="w-4 h-4" /> Join another device</h2>
            <p className="text-sm text-[var(--muted)]">Type the 6-character code shown on the other screen.</p>
            <form onSubmit={(e) => { e.preventDefault(); connectTo(); }} className="flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="ABC234"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                aria-label="Pairing code"
                className="flex-1 min-w-0 font-mono tracking-[0.25em] uppercase rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[var(--ink)] focus:outline-none focus:border-[var(--pine)]"
              />
              <button type="submit" disabled={status === "starting" || joinCode.length !== 6} className="px-4 py-2 rounded-md bg-[var(--pine)] text-white text-sm font-semibold disabled:opacity-50">
                Connect
              </button>
            </form>
            <ul className="mt-auto text-xs text-[var(--muted)] space-y-1 list-disc pl-4">
              <li>Works on Wi-Fi or mobile data — devices don&apos;t need the same network.</li>
              <li>Keep this page open on both devices while sending.</li>
              <li>No size limit; very large files depend on the receiving device&apos;s memory.</li>
            </ul>
          </section>
        </div>
      )}

      {connected && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 flex flex-col gap-3">
            <h2 className="font-semibold text-[var(--ink)]">Send text or a link</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) sendText(); }}
              rows={5}
              placeholder="Paste anything…"
              className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--pine)] resize-y"
            />
            <button onClick={sendText} disabled={!text.trim()} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--pine)] text-white text-sm font-semibold disabled:opacity-50">
              <Send className="w-4 h-4" /> Send text
            </button>
          </section>

          <section
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); sendFiles(e.dataTransfer.files); }}
            className={`rounded-lg border-2 border-dashed p-5 flex flex-col items-center justify-center gap-3 text-center ${dragOver ? "border-[var(--pine)] bg-[var(--pine-tint)]" : "border-[var(--line)] bg-[var(--surface)]"}`}
          >
            <FileUp className="w-8 h-8 text-[var(--muted)]" />
            <p className="text-sm text-[var(--ink)]">Drop files here or</p>
            <button onClick={() => fileInput.current?.click()} className="px-4 py-2 rounded-md border border-[var(--line)] text-sm font-semibold text-[var(--ink)] hover:bg-[var(--sunken)]">
              Choose files
            </button>
            <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => { sendFiles(e.target.files); e.target.value = ""; }} />
          </section>
        </div>
      )}

      {items.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--ink)]">This session</h2>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 flex items-start gap-3">
                <span className={`mt-0.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${it.from === "me" ? "bg-[var(--sunken)] text-[var(--muted)]" : "bg-[var(--pine-tint)] text-[var(--pine)]"}`}>
                  {it.from === "me" ? "Sent" : "Received"}
                </span>
                <div className="flex-1 min-w-0">
                  {it.kind === "text" ? (
                    isUrl(it.text) ? (
                      <a href={it.text} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--pine)] break-all inline-flex items-center gap-1"><Link2 className="w-3.5 h-3.5 shrink-0" />{it.text}</a>
                    ) : (
                      <p className="text-sm text-[var(--ink)] whitespace-pre-wrap break-words">{it.text}</p>
                    )
                  ) : (
                    <>
                      <p className="text-sm text-[var(--ink)] truncate">{it.name}</p>
                      <p className="text-xs text-[var(--muted)]">{fmtBytes(it.size)}{it.progress < 100 ? ` · ${it.progress}%` : ""}</p>
                      {it.progress < 100 && (
                        <div className="mt-1.5 h-1.5 rounded bg-[var(--sunken)] overflow-hidden"><div className="h-full bg-[var(--pine)] transition-[width]" style={{ width: `${it.progress}%` }} /></div>
                      )}
                    </>
                  )}
                </div>
                {it.kind === "text" && (
                  <button onClick={() => copy(it.id, it.text)} aria-label="Copy" className="p-1.5 rounded hover:bg-[var(--sunken)] text-[var(--muted)]">
                    {copied === it.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
                {it.kind === "file" && it.url && (
                  <a href={it.url} download={it.name} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[var(--pine)] text-white text-xs font-semibold">
                    <Download className="w-3.5 h-3.5" /> Save
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
