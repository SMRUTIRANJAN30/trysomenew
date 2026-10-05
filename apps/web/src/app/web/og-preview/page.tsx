"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Globe } from "lucide-react";

export default function OgPreviewPage() {
  const [title, setTitle] = useState("trysomenew — One Fast Workspace for Documents, Files & Devices");
  const [description, setDescription] = useState(
    "Fast, privacy-first all-in-one document workspace. Merge, split, rotate, compress PDFs, and verify cryptographic SHA-256 integrity."
  );
  const [url, setUrl] = useState("https://trysomenew.com");
  const [imageUrl, setImageUrl] = useState("https://trysomenew.com/og-image.png");
  const [copied, setCopied] = useState(false);

  const metaTagsCode = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${imageUrl}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  const copy = () => {
    navigator.clipboard.writeText(metaTagsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      title="Open Graph & Social Preview"
      description="Preview how your web pages look when shared on Twitter/X, LinkedIn, Facebook, and search engines."
      actions={
        <button onClick={copy} className="btn-primary flex items-center gap-1.5 text-xs py-2">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied HTML Tags" : "Copy Meta Tags"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metadata Inputs */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Page Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)]"
              />
              <span className="text-[11px] text-[var(--muted-text)] mt-1 block">{title.length} characters</span>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-xs text-[var(--foreground)] resize-none"
              />
              <span className="text-[11px] text-[var(--muted-text)] mt-1 block">{description.length} characters</span>
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Canonical URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-xs text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">OG Image URL</label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2 text-xs text-[var(--foreground)]"
              />
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-[var(--foreground)]">Twitter / Social Card Preview</span>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden shadow-lg">
              <div className="h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-950 flex items-center justify-center p-6 text-center border-b border-[var(--border-subtle)] relative">
                <span className="text-base font-bold text-white tracking-tight">{title}</span>
              </div>
              <div className="p-4 space-y-1">
                <div className="text-[11px] text-[var(--muted-text)] uppercase font-semibold flex items-center gap-1">
                  <Globe size={11} /> {url.replace(/^https?:\/\//, "")}
                </div>
                <h4 className="text-sm font-bold text-[var(--foreground)] leading-snug">{title}</h4>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Google Search Preview */}
            <span className="text-xs font-semibold text-[var(--foreground)] block pt-2">Google Search Snippet</span>
            <div className="glass rounded-xl p-4 space-y-1">
              <div className="text-[11px] text-emerald-500 font-mono">{url}</div>
              <div className="text-sm font-medium text-blue-500 hover:underline cursor-pointer">{title}</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">{description}</div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
