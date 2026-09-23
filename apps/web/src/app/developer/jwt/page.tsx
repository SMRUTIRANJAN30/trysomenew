"use client";
import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, AlertCircle } from "lucide-react";

interface JwtPayload {
  [key: string]: unknown;
}

function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts separated by dots.");
  const decode = (s: string) => {
    const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(s.length + (4 - s.length % 4) % 4, "=");
    return JSON.parse(atob(padded));
  };
  return {
    header: decode(parts[0]) as JwtPayload,
    payload: decode(parts[1]) as JwtPayload,
    signature: parts[2],
  };
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const [result, setResult] = useState<{ header: JwtPayload; payload: JwtPayload; signature: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const decode = () => {
    setError("");
    try {
      setResult(decodeJwt(token.trim()));
    } catch (e: unknown) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 2000);
  };

  const isExpired = result?.payload?.exp ? (result.payload.exp as number) * 1000 < Date.now() : null;

  const Section = ({ title, data, id }: { title: string; data: JwtPayload; id: string }) => (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">{title}</span>
        <button onClick={() => copy(JSON.stringify(data, null, 2), id)} className="text-gray-500 hover:text-white transition-colors">
          {copied === id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );

  return (
    <ToolShell title="JWT Decoder" description="Decode and inspect JWT (JSON Web Token) headers and payloads. Never sends your token anywhere.">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">JWT Token</label>
          <textarea
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full h-28 bg-[#0d1117] border border-white/10 rounded-xl p-4 text-xs font-mono text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Paste your JWT token here..."
          />
        </div>

        <button onClick={decode} className="btn-primary w-full">Decode JWT</button>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />{error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {isExpired !== null && (
              <div className={`p-3 rounded-xl border text-sm flex items-center gap-2 ${isExpired ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                {isExpired ? "⚠️ Token has expired" : "✅ Token is valid (not expired)"}
                {result.payload.exp ? (
                  <span className="text-xs ml-auto opacity-70">
                    Expires: {new Date((result.payload.exp as number) * 1000).toLocaleString()}
                  </span>
                ) : null}
              </div>
            )}
            <Section title="Header" data={result.header} id="header" />
            <Section title="Payload" data={result.payload} id="payload" />
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Signature (not verified)</span>
              </div>
              <div className="p-4">
                <code className="text-xs font-mono text-gray-500 break-all">{result.signature}</code>
                <p className="text-xs text-gray-600 mt-2">⚠️ Signature verification requires the secret key, which is never transmitted.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
