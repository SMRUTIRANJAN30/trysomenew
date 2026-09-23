"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

type QRMode = "url" | "text" | "email" | "phone" | "wifi" | "vcard" | "sms";

const WIFI_SECURITY = ["WPA", "WEP", "nopass"] as const;

export default function QrGeneratorPage() {
  const [mode, setMode] = useState<QRMode>("url");
  const [url, setUrl] = useState("https://trysomenew.app");
  const [text, setText] = useState("Hello from trysomenew!");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [wifiSsid, setWifiSsid] = useState("MyNetwork");
  const [wifiPwd, setWifiPwd] = useState("mypassword");
  const [wifiSecurity, setWifiSecurity] = useState<typeof WIFI_SECURITY[number]>("WPA");
  const [vcName, setVcName] = useState("John Doe");
  const [vcPhone, setVcPhone] = useState("+1-234-567-8900");
  const [vcEmail, setVcEmail] = useState("john@example.com");
  const [vcOrg, setVcOrg] = useState("Acme Inc.");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [qrData, setQrData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const buildContent = useCallback((): string => {
    switch (mode) {
      case "url": return url;
      case "text": return text;
      case "email": return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
      case "phone": return `tel:${phone}`;
      case "wifi": return `WIFI:T:${wifiSecurity};S:${wifiSsid};P:${wifiPwd};;`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcOrg}\nEND:VCARD`;
      case "sms": return `SMSTO:${smsPhone}:${smsBody}`;
      default: return url;
    }
  }, [mode, url, text, email, emailSubject, phone, wifiSsid, wifiPwd, wifiSecurity, vcName, vcPhone, vcEmail, vcOrg, smsPhone, smsBody]);

  const generate = useCallback(async () => {
    const content = buildContent();
    if (!content.trim()) return;
    try {
      const dataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });
      setQrData(dataUrl);
    } catch (e) {
      console.error(e);
    }
  }, [buildContent, size, fgColor, bgColor]);

  useEffect(() => { generate(); }, [generate]);

  const download = () => {
    if (!qrData) return;
    const a = document.createElement("a");
    a.href = qrData;
    a.download = `qr-${mode}.png`;
    a.click();
  };

  const copyImage = async () => {
    if (!qrData) return;
    const res = await fetch(qrData);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const MODES: { id: QRMode; label: string; icon: string }[] = [
    { id: "url", label: "URL", icon: "🔗" },
    { id: "text", label: "Text", icon: "💬" },
    { id: "wifi", label: "WiFi", icon: "📶" },
    { id: "vcard", label: "Contact", icon: "👤" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "phone", label: "Phone", icon: "📞" },
    { id: "sms", label: "SMS", icon: "💬" },
  ];

  return (
    <ToolShell title="QR Code Generator" description="Generate QR codes for URLs, text, WiFi, contacts, emails, and more. Download as PNG.">
      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap border transition-colors ${mode === m.id ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input panel */}
          <div className="glass rounded-2xl p-5 space-y-4">
            {mode === "url" && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">URL</label>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="https://example.com" />
              </div>
            )}
            {mode === "text" && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Text</label>
                <textarea value={text} onChange={e => setText(e.target.value)}
                  className="w-full h-24 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
            )}
            {mode === "email" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Email Address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Subject (optional)</label>
                  <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
              </>
            )}
            {mode === "phone" && (
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" placeholder="+1234567890" />
              </div>
            )}
            {mode === "wifi" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Network Name (SSID)</label>
                  <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Password</label>
                  <input value={wifiPwd} onChange={e => setWifiPwd(e.target.value)} type="password"
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Security</label>
                  <div className="flex gap-2">
                    {WIFI_SECURITY.map(s => (
                      <button key={s} onClick={() => setWifiSecurity(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${wifiSecurity === s ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-300"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {mode === "vcard" && (
              <>
                {[
                  { label: "Full Name", val: vcName, set: setVcName },
                  { label: "Phone", val: vcPhone, set: setVcPhone },
                  { label: "Email", val: vcEmail, set: setVcEmail },
                  { label: "Organization", val: vcOrg, set: setVcOrg },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)}
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                  </div>
                ))}
              </>
            )}
            {mode === "sms" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                  <input value={smsPhone} onChange={e => setSmsPhone(e.target.value)}
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Message (optional)</label>
                  <textarea value={smsBody} onChange={e => setSmsBody(e.target.value)}
                    className="w-full h-20 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 resize-none focus:outline-none" />
                </div>
              </>
            )}

            {/* Styling */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Foreground:</span>
                  <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/10 p-0.5" />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Background:</span>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border border-white/10 p-0.5" />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Size: <strong className="text-white">{size}px</strong></span>
                <input type="range" min={100} max={600} value={size} onChange={e => setSize(Number(e.target.value))}
                  className="flex-1 accent-blue-500" />
              </div>
            </div>
          </div>

          {/* QR Preview */}
          <div className="flex flex-col items-center justify-center gap-4">
            {qrData ? (
              <>
                <div className="p-4 rounded-2xl border border-white/10" style={{ background: bgColor }}>
                  <img src={qrData} alt="Generated QR Code" className="rounded-xl" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
                </div>
                <div className="flex gap-2">
                  <button onClick={download} className="btn-primary flex items-center gap-2">
                    <Download size={14} />Download PNG
                  </button>
                  <button onClick={copyImage} className="btn-secondary flex items-center gap-2">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    Copy Image
                  </button>
                </div>
              </>
            ) : (
              <div className="w-64 h-64 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center">
                <p className="text-gray-600 text-sm">QR will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
