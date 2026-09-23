"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, Copy, Check, QrCode } from "lucide-react";
import QRCode from "qrcode";

type QRMode = "url" | "text" | "email" | "phone" | "wifi" | "vcard" | "sms";

const WIFI_SECURITY = ["WPA", "WEP", "nopass"] as const;

export default function QrGeneratorPage() {
  const [mode, setMode] = useState<QRMode>("url");
  const [url, setUrl] = useState("https://trysomenew.netlify.app");
  const [text, setText] = useState("Hello from trysomenew!");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [wifiSsid, setWifiSsid] = useState("MyNetwork");
  const [wifiPwd, setWifiPwd] = useState("mypassword");
  const [wifiSecurity, setWifiSecurity] = useState<typeof WIFI_SECURITY[number]>("WPA");
  const [vcName, setVcName] = useState("Smrutiranjan Sahoo");
  const [vcPhone, setVcPhone] = useState("+91 9876543210");
  const [vcEmail, setVcEmail] = useState("smrutiranjan@trysomenew.com");
  const [vcOrg, setVcOrg] = useState("TrySomeNew");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [fgColor, setFgColor] = useState("#090d16");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [qrData, setQrData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    a.download = `trysomenew-qr-${mode}.png`;
    a.click();
  };

  const copyImage = async () => {
    if (!qrData) return;
    try {
      const res = await fetch(qrData);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without ClipboardItem write permission
      navigator.clipboard.writeText(buildContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const MODES: { id: QRMode; label: string; icon: string }[] = [
    { id: "url", label: "URL", icon: "🔗" },
    { id: "text", label: "Text", icon: "💬" },
    { id: "wifi", label: "WiFi", icon: "📶" },
    { id: "vcard", label: "Contact", icon: "👤" },
    { id: "email", label: "Email", icon: "✉️" },
    { id: "phone", label: "Phone", icon: "📞" },
    { id: "sms", label: "SMS", icon: "📱" },
  ];

  return (
    <ToolShell title="QR Code Generator" description="Generate high-resolution, instant scannable QR codes for links, text, WiFi, contacts, and phone numbers.">
      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                mode === m.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 space-y-4 shadow-sm">
            {mode === "url" && (
              <div>
                <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Target Website URL</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            )}

            {mode === "text" && (
              <div>
                <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Plain Text or Note</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-28 bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] resize-none focus:outline-none focus:border-blue-500"
                  placeholder="Type any message to embed inside the QR code..."
                />
              </div>
            )}

            {mode === "email" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Recipient Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Default Subject</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                    placeholder="Inquiry"
                  />
                </div>
              </div>
            )}

            {mode === "phone" && (
              <div>
                <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                  placeholder="+1 234 567 890"
                />
              </div>
            )}

            {mode === "wifi" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Network SSID</label>
                  <input
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Wi-Fi Password</label>
                  <input
                    value={wifiPwd}
                    onChange={(e) => setWifiPwd(e.target.value)}
                    type="password"
                    className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Security Mode</label>
                  <div className="flex gap-2">
                    {WIFI_SECURITY.map((s) => (
                      <button
                        key={s}
                        onClick={() => setWifiSecurity(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          wifiSecurity === s
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-black/5 dark:bg-white/10 border-[var(--border-subtle)] text-[var(--foreground)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "vcard" && (
              <div className="space-y-3">
                {[
                  { label: "Full Name", val: vcName, set: setVcName },
                  { label: "Phone", val: vcPhone, set: setVcPhone },
                  { label: "Email", val: vcEmail, set: setVcEmail },
                  { label: "Organization", val: vcOrg, set: setVcOrg },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1">{f.label}</label>
                    <input
                      value={f.val}
                      onChange={(e) => f.set(e.target.value)}
                      className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {mode === "sms" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Phone Number</label>
                  <input
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--foreground)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-text)] block mb-1.5">Pre-filled Message</label>
                  <textarea
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="w-full h-20 bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs text-[var(--foreground)] resize-none focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Custom Styling Controls */}
            <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>Foreground:</span>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border border-[var(--border-subtle)] p-0.5"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>Background:</span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border border-[var(--border-subtle)] p-0.5"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--muted)]">
                  Resolution: <strong className="text-[var(--foreground)]">{size}px</strong>
                </span>
                <input
                  type="range"
                  min={150}
                  max={600}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* QR Preview Display */}
          <div className="flex flex-col items-center justify-center gap-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm">
            {qrData ? (
              <>
                <div className="p-4 rounded-2xl border border-[var(--border-subtle)] shadow-md" style={{ background: bgColor }}>
                  <img
                    src={qrData}
                    alt="Generated QR Code"
                    className="rounded-lg object-contain"
                    style={{ width: Math.min(size, 260), height: Math.min(size, 260) }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button onClick={download} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer">
                    <Download size={14} />
                    <span>Download PNG</span>
                  </button>
                  <button onClick={copyImage} className="px-4 py-2 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--foreground)] border border-[var(--card-border)] text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? "Copied ✓" : "Copy"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--muted-text)] gap-2">
                <QrCode className="w-8 h-8 opacity-40" />
                <p className="text-xs">QR code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
