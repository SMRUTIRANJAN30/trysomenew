"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Download, Plus, Trash2 } from "lucide-react";

export default function RobotsGeneratorPage() {
  const [userAgent, setUserAgent] = useState("*");
  const [disallows, setDisallows] = useState<string[]>(["/api/", "/admin/", "/_next/"]);
  const [newDisallow, setNewDisallow] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("https://trysomenew.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate robots.txt content
  let robotsContent = `User-agent: ${userAgent}\nAllow: /\n`;
  for (const d of disallows) {
    if (d.trim()) robotsContent += `Disallow: ${d.trim()}\n`;
  }
  if (crawlDelay) {
    robotsContent += `Crawl-delay: ${crawlDelay}\n`;
  }
  if (sitemapUrl) {
    robotsContent += `\nSitemap: ${sitemapUrl.trim()}\n`;
  }

  const addDisallow = () => {
    if (newDisallow.trim() && !disallows.includes(newDisallow.trim())) {
      setDisallows([...disallows, newDisallow.trim()]);
      setNewDisallow("");
    }
  };

  const removeDisallow = (idx: number) => {
    setDisallows(disallows.filter((_, i) => i !== idx));
  };

  const copy = () => {
    navigator.clipboard.writeText(robotsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([robotsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      title="Robots.txt Generator"
      description="Create search engine crawling rules, manage crawler directives, and export a standardized robots.txt file."
      actions={
        <div className="flex gap-2">
          <button onClick={copy} className="btn-secondary flex items-center gap-1.5 text-xs py-2">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={download} className="btn-primary flex items-center gap-1.5 text-xs py-2">
            <Download size={14} /> Download robots.txt
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">User Agent</label>
              <input
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
                placeholder="*"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Sitemap URL</label>
              <input
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
                placeholder="https://example.com/sitemap.xml"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Disallowed Directories / Paths</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={newDisallow}
                  onChange={(e) => setNewDisallow(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDisallow();
                    }
                  }}
                  className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-xs text-[var(--foreground)]"
                  placeholder="/private/"
                />
                <button onClick={addDisallow} className="btn-primary py-2 px-3 text-xs flex items-center gap-1">
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {disallows.map((d, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg text-xs font-mono text-[var(--foreground)]">
                    <span>{d}</span>
                    <button onClick={() => removeDisallow(i)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <span className="text-xs font-semibold text-[var(--foreground)] mb-2">Live robots.txt Output</span>
            <pre className="flex-1 min-h-[260px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] overflow-x-auto whitespace-pre">
              {robotsContent}
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
