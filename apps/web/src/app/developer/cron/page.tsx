"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check } from "lucide-react";

function parseCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression — needs exactly 5 fields: minute hour day month weekday";

  const [min, hour, dom, month, dow] = parts;

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dowNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const describeField = (val: string, names?: string[], unit?: string): string => {
    if (val === "*") return `every ${unit || "unit"}`;
    if (val.startsWith("*/")) return `every ${val.slice(2)} ${unit || "unit"}(s)`;
    if (val.includes("-")) {
      const [s, e] = val.split("-");
      return `${unit} ${names ? names[Number(s)] || s : s} through ${names ? names[Number(e)] || e : e}`;
    }
    if (val.includes(",")) {
      const list = val.split(",").map(v => names ? names[Number(v)] || v : v);
      return `${unit}s ${list.join(", ")}`;
    }
    return `${unit} ${names ? names[Number(val)] || val : val}`;
  };

  const minuteDesc = describeField(min, undefined, "minute");
  const hourDesc = describeField(hour, undefined, "hour");
  const domDesc = dom === "*" ? "" : `on day ${dom} of the month`;
  const monthDesc = describeField(month, monthNames, "month");
  const dowDesc = describeField(dow, dowNames, "weekday");

  let out = `Runs at ${minuteDesc} past ${hourDesc}`;
  if (domDesc) out += `, ${domDesc}`;
  if (month !== "*") out += `, in ${monthDesc}`;
  if (dow !== "*") out += `, on ${dowDesc}`;

  return out;
}

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Sunday", value: "0 0 * * 0" },
  { label: "Every weekday 9 AM", value: "0 9 * * 1-5" },
  { label: "Every month 1st", value: "0 0 1 * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every 6 hours", value: "0 */6 * * *" },
  { label: "Every New Year", value: "0 0 1 1 *" },
];

export default function CronPage() {
  const [expr, setExpr] = useState("*/15 * * * *");
  const [copied, setCopied] = useState(false);

  const description = parseCron(expr);
  const isValid = !description.startsWith("Invalid");

  const copy = () => {
    navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parts = expr.trim().split(/\s+/);
  const fieldLabels = ["Minute (0-59)", "Hour (0-23)", "Day of Month (1-31)", "Month (1-12)", "Day of Week (0-6)"];

  return (
    <ToolShell title="Cron Expression Parser" description="Parse and understand cron schedule expressions with plain-English descriptions.">
      <div className="space-y-5">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="flex gap-2">
            <input
              value={expr}
              onChange={e => setExpr(e.target.value)}
              className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="* * * * *"
            />
            <button onClick={copy} className="btn-secondary flex items-center gap-1.5">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Field labels */}
          {parts.length === 5 && (
            <div className="grid grid-cols-5 gap-2">
              {parts.map((p, i) => (
                <div key={i} className="text-center">
                  <div className={`text-sm font-mono font-bold px-2 py-1 rounded-lg border ${isValid ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-gray-500 bg-white/5 border-white/10"}`}>{p}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">{fieldLabels[i]}</div>
                </div>
              ))}
            </div>
          )}

          <div className={`p-4 rounded-xl border ${isValid ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
            <p className={`text-sm ${isValid ? "text-emerald-300" : "text-red-400"}`}>{description}</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Common Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map(p => (
              <button key={p.value} onClick={() => setExpr(p.value)}
                className="flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-left"
              >
                <span className="text-sm text-gray-300">{p.label}</span>
                <code className="text-xs text-blue-400">{p.value}</code>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
