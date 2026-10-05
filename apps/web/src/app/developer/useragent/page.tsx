"use client";

import { useState, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Laptop, Globe, Cpu, Monitor, RefreshCw } from "lucide-react";

interface ParsedUa {
  browser: string;
  os: string;
  device: string;
  engine: string;
}

function parseUserAgentString(ua: string): ParsedUa {
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let device = "Desktop / Laptop";
  let engine = "Blink / WebKit";

  // Browser detection
  if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome\//i.test(ua)) browser = "Google Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
  else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";

  // OS detection
  if (/Windows NT 10.0/i.test(ua)) os = "Windows 10 / 11";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
    device = "Apple Mobile Device";
  } else if (/Android/i.test(ua)) {
    os = "Android OS";
    device = "Android Device";
  } else if (/Linux/i.test(ua)) os = "Linux";

  // Engine
  if (/Gecko\//i.test(ua) && /Firefox\//i.test(ua)) engine = "Gecko";
  else if (/AppleWebKit\//i.test(ua)) engine = "AppleWebKit / Blink";

  return { browser, os, device, engine };
}

export default function UserAgentParserPage() {
  const [uaInput, setUaInput] = useState("");
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUaInput(navigator.userAgent);
      setScreenInfo({
        width: window.screen.width,
        height: window.screen.height,
        dpr: window.devicePixelRatio || 1,
      });
    }
  }, []);

  const parsed = parseUserAgentString(uaInput);

  const resetToCurrent = () => {
    if (typeof window !== "undefined") {
      setUaInput(navigator.userAgent);
    }
  };

  return (
    <ToolShell
      title="User Agent Parser & Client Inspector"
      description="Break down browser user-agent strings to inspect operating system, browser engine, client device, and screen geometry."
      actions={
        <button onClick={resetToCurrent} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
          <RefreshCw size={14} /> Reset to My Device
        </button>
      }
    >
      <div className="space-y-6">
        {/* User Agent Input */}
        <div className="glass rounded-2xl p-6 space-y-3">
          <label className="text-xs font-semibold text-[var(--foreground)] block">User Agent String</label>
          <textarea
            value={uaInput}
            onChange={(e) => setUaInput(e.target.value)}
            className="w-full h-24 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Mozilla/5.0 ..."
          />
        </div>

        {/* Parsed Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div className="text-xs text-[var(--muted)]">Browser</div>
            <div className="text-sm font-bold text-[var(--foreground)]">{parsed.browser}</div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Laptop size={18} />
            </div>
            <div className="text-xs text-[var(--muted)]">Operating System</div>
            <div className="text-sm font-bold text-[var(--foreground)]">{parsed.os}</div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <div className="text-xs text-[var(--muted)]">Layout Engine</div>
            <div className="text-sm font-bold text-[var(--foreground)]">{parsed.engine}</div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Monitor size={18} />
            </div>
            <div className="text-xs text-[var(--muted)]">Screen Resolution</div>
            <div className="text-sm font-bold text-[var(--foreground)]">
              {screenInfo.width > 0 ? `${screenInfo.width} × ${screenInfo.height} (${screenInfo.dpr}x)` : "Client Screen"}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
