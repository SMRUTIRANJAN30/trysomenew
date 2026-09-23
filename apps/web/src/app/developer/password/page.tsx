"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Shuffle, Settings } from "lucide-react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const SIMILAR = "0O1lI";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    let charset = "";
    if (useUpper) charset += UPPERCASE;
    if (useLower) charset += LOWERCASE;
    if (useDigits) charset += DIGITS;
    if (useSymbols) charset += SYMBOLS;
    if (excludeSimilar) charset = charset.split("").filter(c => !SIMILAR.includes(c)).join("");
    if (!charset) return;

    const arr = new Uint32Array(length * count);
    crypto.getRandomValues(arr);
    const generated: string[] = [];
    for (let i = 0; i < count; i++) {
      let pw = "";
      for (let j = 0; j < length; j++) {
        pw += charset[arr[i * length + j] % charset.length];
      }
      generated.push(pw);
    }
    setPasswords(generated);
  };

  const strength = (pw: string): { label: string; color: string; width: string } => {
    let score = 0;
    if (pw.length >= 12) score++;
    if (pw.length >= 20) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    const map = [
      { label: "Weak", color: "bg-red-500", width: "20%" },
      { label: "Fair", color: "bg-orange-500", width: "40%" },
      { label: "Good", color: "bg-yellow-500", width: "60%" },
      { label: "Strong", color: "bg-emerald-500", width: "80%" },
      { label: "Very Strong", color: "bg-emerald-400", width: "100%" },
    ];
    return map[Math.min(score - 1, 4)] ?? map[0];
  };

  const copy = (pw: string, idx: number) => {
    navigator.clipboard.writeText(pw);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const Option = ({ label, state, setter }: { label: string; state: boolean; setter: (v: boolean) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        className={`w-10 h-5 rounded-full transition-colors relative ${state ? "bg-blue-600" : "bg-white/10"}`}
        onClick={() => setter(!state)}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${state ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );

  return (
    <ToolShell title="Password Generator" description="Generate cryptographically secure passwords using crypto.getRandomValues(). Zero server communication.">
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Length: <span className="text-white font-bold">{length}</span></label>
            </div>
            <input
              type="range" min={8} max={128} value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Option label="Uppercase (A-Z)" state={useUpper} setter={setUseUpper} />
            <Option label="Lowercase (a-z)" state={useLower} setter={setUseLower} />
            <Option label="Digits (0-9)" state={useDigits} setter={setUseDigits} />
            <Option label="Symbols (!@#...)" state={useSymbols} setter={setUseSymbols} />
            <Option label="Exclude Similar (0O, 1lI)" state={excludeSimilar} setter={setExcludeSimilar} />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Count:</label>
            {[1, 5, 10].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${count === n ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
              >{n}</button>
            ))}
          </div>

          <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2">
            <Shuffle size={16} />Generate Passwords
          </button>
        </div>

        {passwords.length > 0 && (
          <div className="space-y-3">
            {passwords.map((pw, i) => {
              const s = strength(pw);
              return (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm font-mono text-gray-200 break-all flex-1">{pw}</code>
                    <button onClick={() => copy(pw, i)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white shrink-0 transition-colors">
                      {copied === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${s.color}`} style={{ width: s.width }} />
                    </div>
                    <span className={`text-xs ${s.color.replace("bg-", "text-")}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
