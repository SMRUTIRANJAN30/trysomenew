"use client";

import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Copy, Check, Crosshair, Grid, Layers, ShieldCheck, Sparkles } from "lucide-react";
import SparkMD5 from "spark-md5";

const ALGOS = [
  { id: "MD5", label: "MD5" },
  { id: "SHA-1", label: "SHA-1" },
  { id: "SHA-256", label: "SHA-256" },
  { id: "SHA-512", label: "SHA-512" },
] as const;

type Algo = typeof ALGOS[number]["id"];

interface SelectedPartInfo {
  row: number;
  col: number;
  gridSize: number;
  x: number;
  y: number;
  w: number;
  h: number;
  thumbnailUrl: string;
  md5: string;
  sha256: string;
  byteSize: number;
}

interface SelectedChunkInfo {
  index: number;
  totalChunks: number;
  startByte: number;
  endByte: number;
  size: number;
  md5: string;
  sha256: string;
}

export default function HashFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Partial<Record<Algo, string>>>({});
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verifyInput, setVerifyInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Image part inspector state
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 default
  const [selectedPart, setSelectedPart] = useState<SelectedPartInfo | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Non-image chunk inspector state
  const [selectedChunk, setSelectedChunk] = useState<SelectedChunkInfo | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const computeHashes = async (f: File) => {
    setFile(f);
    setHashes({});
    setSelectedPart(null);
    setSelectedChunk(null);
    setLoading(true);
    setProgress(0);

    const isImg = f.type.startsWith("image/") || f.name.match(/\.(png|jpe?g|webp|gif|bmp|svg)$/i);
    if (isImg) {
      const url = URL.createObjectURL(f);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }

    const buffer = await f.arrayBuffer();
    setFileBuffer(buffer);
    setProgress(40);

    const results: Partial<Record<Algo, string>> = {};

    // MD5
    results["MD5"] = SparkMD5.ArrayBuffer.hash(buffer);
    setProgress(60);

    // SHA-1
    const sha1buf = await crypto.subtle.digest("SHA-1", buffer);
    results["SHA-1"] = Array.from(new Uint8Array(sha1buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    setProgress(75);

    // SHA-256
    const sha256buf = await crypto.subtle.digest("SHA-256", buffer);
    results["SHA-256"] = Array.from(new Uint8Array(sha256buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    setProgress(90);

    // SHA-512
    const sha512buf = await crypto.subtle.digest("SHA-512", buffer);
    results["SHA-512"] = Array.from(new Uint8Array(sha512buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    setProgress(100);

    setHashes(results);
    setLoading(false);
  };

  // Inspect specific image part when clicked
  const handleInspectImagePart = async (row: number, col: number) => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const cellW = Math.floor(img.width / gridSize);
    const cellH = Math.floor(img.height / gridSize);
    const startX = col * cellW;
    const startY = row * cellH;

    const canvas = document.createElement("canvas");
    canvas.width = cellW;
    canvas.height = cellH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, startX, startY, cellW, cellH, 0, 0, cellW, cellH);

    const partDataUrl = canvas.toDataURL("image/png");

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const partBuf = await blob.arrayBuffer();

      // Compute part hashes
      const partMd5 = SparkMD5.ArrayBuffer.hash(partBuf);
      const partSha256Buf = await crypto.subtle.digest("SHA-256", partBuf);
      const partSha256 = Array.from(new Uint8Array(partSha256Buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      setSelectedPart({
        row,
        col,
        gridSize,
        x: startX,
        y: startY,
        w: cellW,
        h: cellH,
        thumbnailUrl: partDataUrl,
        md5: partMd5,
        sha256: partSha256,
        byteSize: partBuf.byteLength,
      });
    }, "image/png");
  };

  // Inspect non-image file chunk
  const handleInspectFileChunk = async (chunkIndex: number, totalChunks: number = 16) => {
    if (!fileBuffer) return;
    const totalBytes = fileBuffer.byteLength;
    const chunkSize = Math.ceil(totalBytes / totalChunks);
    const startByte = chunkIndex * chunkSize;
    const endByte = Math.min(startByte + chunkSize, totalBytes);

    const slice = fileBuffer.slice(startByte, endByte);

    const partMd5 = SparkMD5.ArrayBuffer.hash(slice);
    const partSha256Buf = await crypto.subtle.digest("SHA-256", slice);
    const partSha256 = Array.from(new Uint8Array(partSha256Buf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    setSelectedChunk({
      index: chunkIndex,
      totalChunks,
      startByte,
      endByte,
      size: slice.byteLength,
      md5: partMd5,
      sha256: partSha256,
    });
  };

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatBytes = (b: number) =>
    b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`;

  const verifyHash = verifyInput.trim().toLowerCase();
  const verifyMatch = verifyHash ? Object.values(hashes).some(h => h?.toLowerCase() === verifyHash) : null;

  return (
    <ToolShell
      title="File Hash Checker & Part Inspector"
      description="Verify file integrity with MD5, SHA-1, SHA-256, and SHA-512. Click any part or region of an image to view that exact part's hash code."
    >
      <div className="space-y-6">
        {/* Upload Dropzone */}
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/[0.02] transition-all">
            <div className="text-4xl mb-2">{file ? "✅" : "📁"}</div>
            <p className="text-sm font-medium text-gray-200">
              {file ? file.name : "Drop any image or file, or click to select"}
            </p>
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                {formatBytes(file.size)} · {file.type || "binary"}
              </p>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={e => e.target.files?.[0] && computeHashes(e.target.files[0])}
          />
        </label>

        {loading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Computing cryptographic hashes...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── VISUAL PART INSPECTION: WHEN IMAGE IS LOADED ── */}
        {imageUrl && !loading && (
          <div className="glass rounded-2xl p-5 border border-blue-500/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Crosshair size={18} className="text-cyan-400" />
                <h4 className="text-sm font-semibold text-gray-200">
                  Interactive Part Hash Inspector
                </h4>
              </div>

              {/* Grid Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Inspector Grid:</span>
                {[2, 3, 4, 8].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setGridSize(sz);
                      setSelectedPart(null);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      gridSize === sz
                        ? "border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {sz}×{sz}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">
              💡 <strong>Click any section of the image</strong> below to calculate and inspect the exact hash code of that specific cropped part:
            </p>

            {/* Interactive Image with Grid Overlay */}
            <div className="relative inline-block max-w-full rounded-xl overflow-hidden border border-white/20 bg-black/50 select-none shadow-xl">
              <img
                src={imageUrl}
                alt="File preview for hash inspection"
                className="max-h-[380px] w-auto object-contain block mx-auto pointer-events-none"
              />

              {/* Grid Overlay */}
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                  const r = Math.floor(idx / gridSize);
                  const c = idx % gridSize;
                  const isSelected = selectedPart?.row === r && selectedPart?.col === c && selectedPart.gridSize === gridSize;
                  const isHovered = hoveredCell?.row === r && hoveredCell?.col === c;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleInspectImagePart(r, c)}
                      onMouseEnter={() => setHoveredCell({ row: r, col: c })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`relative border border-dashed cursor-pointer transition-all ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/30 ring-2 ring-cyan-400/80 shadow-lg shadow-cyan-500/30 z-10"
                          : isHovered
                          ? "border-cyan-300/80 bg-white/15 z-0"
                          : "border-white/15 hover:border-cyan-400/50"
                      }`}
                      title={`Click to inspect Part [Row ${r + 1}, Col ${c + 1}]`}
                    >
                      <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-[9px] font-mono text-cyan-300 px-1 py-0.5 rounded pointer-events-none">
                        #{r * gridSize + c + 1}
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            INSPECTED
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Part Details Card */}
            {selectedPart && (
              <div className="glass rounded-xl p-4 border border-cyan-500/30 bg-cyan-950/20 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedPart.thumbnailUrl}
                      alt="Selected part crop"
                      className="w-12 h-12 object-cover rounded-lg border border-cyan-500/50 shadow"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} />
                        Selected Part #{selectedPart.row * selectedPart.gridSize + selectedPart.col + 1} Hash Code
                      </h5>
                      <p className="text-[11px] text-gray-400">
                        Tile [Row {selectedPart.row + 1}, Col {selectedPart.col + 1}] · {selectedPart.w} × {selectedPart.h} px · {formatBytes(selectedPart.byteSize)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exact Part Hashes */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-gray-500 block">Part SHA-256</span>
                      <code className="text-xs font-mono text-cyan-300 break-all">{selectedPart.sha256}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(selectedPart.sha256, "part-sha256")}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs flex items-center gap-1 shrink-0 transition-colors"
                      title="Copy Part SHA-256"
                    >
                      {copied === "part-sha256" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copied === "part-sha256" ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-gray-500 block">Part MD5</span>
                      <code className="text-xs font-mono text-cyan-300 break-all">{selectedPart.md5}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(selectedPart.md5, "part-md5")}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs flex items-center gap-1 shrink-0 transition-colors"
                      title="Copy Part MD5"
                    >
                      {copied === "part-md5" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copied === "part-md5" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VISUAL CHUNK MAP: FOR NON-IMAGE FILES ── */}
        {!imageUrl && file && !loading && fileBuffer && (
          <div className="glass rounded-2xl p-5 border border-blue-500/20 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Layers size={18} className="text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-200">
                Visual File Byte-Chunk Map (Click any block for exact chunk hash)
              </h4>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {Array.from({ length: 16 }).map((_, idx) => {
                const isSelected = selectedChunk?.index === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInspectFileChunk(idx, 16)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-400 bg-blue-500/30 text-white ring-2 ring-blue-500/50"
                        : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/30 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="text-[10px] font-mono block">Chunk</span>
                    <span className="text-xs font-bold text-gray-200">#{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {selectedChunk && (
              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Selected Chunk #{selectedChunk.index + 1} · Offset: {selectedChunk.startByte.toLocaleString()} - {selectedChunk.endByte.toLocaleString()} bytes ({formatBytes(selectedChunk.size)})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 bg-white/[0.03] rounded-lg">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-gray-500 block">Chunk SHA-256</span>
                    <code className="text-xs font-mono text-blue-300 break-all">{selectedChunk.sha256}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(selectedChunk.sha256, "chunk-sha256")}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1 shrink-0"
                  >
                    {copied === "chunk-sha256" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full File Hashes */}
        {Object.keys(hashes).length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Full Document Hashes (Click any row to copy)
              </h4>
              {ALGOS.map(algo => {
                const h = hashes[algo.id];
                if (!h) return null;
                const isCopied = copied === algo.id;
                return (
                  <div
                    key={algo.id}
                    onClick={() => copy(h, algo.id)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-blue-500/40 hover:bg-white/[0.06] ${
                      isCopied ? "border-emerald-500/50 bg-emerald-500/10" : ""
                    }`}
                    title="Click row to copy hash"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                        {algo.label}
                      </span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          copy(h, algo.id);
                        }}
                        className="text-gray-500 hover:text-white transition-colors"
                      >
                        {isCopied ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Check size={13} /> Copied!
                          </span>
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <code className="text-xs font-mono text-gray-300 break-all">{h}</code>
                  </div>
                );
              })}
            </div>

            {/* Verify Section */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Verify Authenticity</h3>
              <p className="text-xs text-gray-500 mb-3">
                Paste an expected checksum to verify if this file matches exactly.
              </p>
              <input
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                placeholder="Paste expected hash here (MD5, SHA-1, SHA-256, SHA-512)..."
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {verifyHash && (
                <div
                  className={`mt-3 p-3 rounded-xl border text-sm flex items-center gap-2 ${
                    verifyMatch
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {verifyMatch ? (
                    <>
                      <ShieldCheck size={16} /> Hash MATCHES — document is authentic and unmodified
                    </>
                  ) : (
                    "❌ Hash DOES NOT MATCH — document may have been altered"
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
