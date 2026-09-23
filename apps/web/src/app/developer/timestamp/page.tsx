"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { RefreshCw, Copy, Check } from "lucide-react";

type Zone = { label: string; tz: string };
const ZONES: Zone[] = [
  { label: "UTC", tz: "UTC" },
  { label: "New York (ET)", tz: "America/New_York" },
  { label: "Los Angeles (PT)", tz: "America/Los_Angeles" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET)", tz: "Europe/Paris" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Mumbai (IST)", tz: "Asia/Kolkata" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "Sydney (AEST)", tz: "Australia/Sydney" },
];

export default function TimestampConverterPage() {
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanInput, setHumanInput] = useState(new Date().toISOString().slice(0, 16));
  const [copied, setCopied] = useState<string | null>(null);

  const ts = parseInt(unix) || 0;
  const date = new Date(ts * 1000);
  const isValid = !isNaN(date.getTime()) && ts > 0;

  const fromHuman = () => {
    const d = new Date(humanInput);
    if (!isNaN(d.getTime())) setUnix(Math.floor(d.getTime() / 1000).toString());
  };

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setUnix(now.toString());
  };

  const copy = (v: string, key: string) => {
    navigator.clipboard.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-sm text-gray-200">{value}</code>
        <button onClick={() => copy(value, label)} className="text-gray-500 hover:text-white transition-colors">
          {copied === label ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );

  return (
    <ToolShell title="Timestamp Converter" description="Convert Unix timestamps to human-readable dates and vice versa. Check time zones globally.">
      <div className="space-y-6">
        {/* Unix → Human */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Unix Timestamp → Human Date</h2>
          <div className="flex gap-2">
            <input
              value={unix}
              onChange={e => setUnix(e.target.value.replace(/\D/g, ""))}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="1695000000"
            />
            <button onClick={setNow} className="btn-secondary flex items-center gap-1.5">
              <RefreshCw size={14} />Now
            </button>
          </div>

          {isValid && (
            <div className="rounded-xl bg-white/5 p-4 space-y-1">
              <Row label="ISO 8601" value={date.toISOString()} />
              <Row label="UTC" value={date.toUTCString()} />
              <Row label="Local" value={date.toLocaleString()} />
              <Row label="Date" value={date.toDateString()} />
              <Row label="Milliseconds" value={(ts * 1000).toString()} />
              <Row label="Nanoseconds" value={(ts * 1_000_000_000).toFixed(0)} />
            </div>
          )}
        </div>

        {/* Human → Unix */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-300">Human Date → Unix Timestamp</h2>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={humanInput}
              onChange={e => setHumanInput(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button onClick={fromHuman} className="btn-primary">Convert</button>
          </div>
        </div>

        {/* World Clock */}
        {isValid && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">World Clock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONES.map(z => {
                const formatted = date.toLocaleString("en-US", { timeZone: z.tz, hour12: true, dateStyle: "medium", timeStyle: "short" });
                return (
                  <div key={z.tz} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-xs text-gray-500">{z.label}</span>
                    <code className="text-xs text-gray-200">{formatted}</code>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
