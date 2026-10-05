"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Upload, FileSearch, ShieldAlert, ShieldCheck } from "lucide-react";

interface InspectionResult {
  name: string;
  declaredType: string;
  detectedType: string;
  isMismatch: boolean;
  size: number;
  magicBytesHex: string;
  sha256: string;
}

// Magic bytes table
function detectMagicMime(bytes: Uint8Array): string {
  if (bytes.length < 4) return "Unknown / Generic Binary";
  // PDF: %PDF (25 50 44 46)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf (PDF Document)";
  // PNG: 89 50 4e 47 0d 0a 1a 0a
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png (PNG Image)";
  // JPEG: ff d8 ff
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg (JPEG Image)";
  // GIF: GIF87a / GIF89a (47 49 46 38)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return "image/gif (GIF Image)";
  // ZIP / DOCX / XLSX / JAR: PK (50 4b 03 04)
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return "application/zip (ZIP / Office Archive)";
  // WebP / RIFF (52 49 46 46)
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return "image/webp or audio/wav (RIFF Container)";
  // Executable Windows PE: MZ (4d 5a)
  if (bytes[0] === 0x4d && bytes[1] === 0x5a) return "application/x-dosexec (Windows PE Executable / DLL)";
  // ELF Linux: 7f 45 4c 46
  if (bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46) return "application/x-executable (Linux ELF Binary)";

  return "application/octet-stream (Binary or Plaintext)";
}

export default function FileInspectPage() {
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // Extract first 32 magic bytes
      const headerBytes = bytes.slice(0, Math.min(32, bytes.length));
      const hexParts: string[] = [];
      for (let i = 0; i < headerBytes.length; i++) {
        hexParts.push(headerBytes[i].toString(16).padStart(2, "0").toUpperCase());
      }
      const magicBytesHex = hexParts.join(" ");

      const detectedType = detectMagicMime(bytes);

      // Compute SHA-256
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256 = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Mismatch detection
      const declared = file.type || "Not declared by browser";
      const isMismatch =
        detectedType.includes("Executable") && !declared.includes("dosexec") && !declared.includes("executable");

      setResult({
        name: file.name,
        declaredType: declared,
        detectedType,
        isMismatch,
        size: file.size,
        magicBytesHex,
        sha256,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ToolShell
      title="File Type & Magic Byte Inspector"
      description="Inspect binary file signatures (magic bytes) to uncover authentic MIME types and detect disguised or tampered file extensions."
    >
      <div className="space-y-6">
        {/* Upload Dropzone */}
        <label className="border-2 border-dashed border-[var(--border-subtle)] hover:border-blue-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-[var(--card-bg)] flex flex-col items-center justify-center gap-3">
          <input type="file" onChange={handleFileUpload} className="hidden" />
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Upload size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Select any file to inspect binary header</p>
            <p className="text-xs text-[var(--muted-text)] mt-1">100% Client-Side. No file is ever transmitted.</p>
          </div>
        </label>

        {result && (
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">{result.name}</h3>
                <span className="text-xs text-[var(--muted)] font-mono">{(result.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex items-center gap-2">
                {result.isMismatch ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1 font-semibold">
                    <ShieldAlert size={14} /> Extension Mismatch Detected
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <ShieldCheck size={14} /> Authentic Binary Signature
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] space-y-1">
                <span className="text-[var(--muted-text)] uppercase font-semibold">Detected MIME Type</span>
                <p className="text-sm font-bold text-[var(--foreground)]">{result.detectedType}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--border-subtle)] space-y-1">
                <span className="text-[var(--muted-text)] uppercase font-semibold">Declared Browser Type</span>
                <p className="text-sm font-mono text-[var(--foreground)]">{result.declaredType}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--foreground)]">Magic Header Bytes (First 32 bytes Hex)</span>
              <pre className="p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] font-mono text-xs text-blue-400 overflow-x-auto">
                {result.magicBytesHex}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--foreground)]">Cryptographic SHA-256 Digest</span>
              <code className="block p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] font-mono text-xs text-emerald-400 break-all">
                {result.sha256}
              </code>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
