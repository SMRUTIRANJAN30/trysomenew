"use client";
import { useState, useCallback, useRef } from "react";
import ToolShell from "@/components/tools/ToolShell";
import JSZip from "jszip";
import { Archive, FolderOpen, File, Download, Trash2, Plus } from "lucide-react";
import { DraggableList } from "@/components/tools/DraggableList";

interface FileEntry {
  id: string;
  name: string;
  size: number;
  blob: Blob;
}

interface ExtractedFile {
  name: string;
  size: number;
  blob: Blob | null;
}

export default function ZipPage() {
  const [mode, setMode] = useState<"create" | "extract">("create");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [extracted, setExtracted] = useState<ExtractedFile[]>([]);
  const [archiveName, setArchiveName] = useState("archive");
  const [loading, setLoading] = useState(false);
  const [zipInfo, setZipInfo] = useState<{ name: string; count: number; originalSize: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: FileEntry[] = Array.from(newFiles).map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      size: f.size,
      blob: f,
    }));
    setFiles(prev => [...prev, ...entries]);
  }, []);

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const createZip = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const zip = new JSZip();
      for (const f of files) zip.file(f.name, f.blob);
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${archiveName}.zip`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const extractZip = async (zipFile: File) => {
    setLoading(true);
    try {
      const zip = await JSZip.loadAsync(zipFile);
      const result: ExtractedFile[] = [];
      const fileNames = Object.keys(zip.files).filter(n => !zip.files[n].dir);
      setZipInfo({ name: zipFile.name, count: fileNames.length, originalSize: zipFile.size });
      for (const name of fileNames) {
        const blob = await zip.file(name)?.async("blob") ?? null;
        result.push({ name, size: blob?.size ?? 0, blob });
      }
      setExtracted(result);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (f: ExtractedFile) => {
    if (!f.blob) return;
    const url = URL.createObjectURL(f.blob);
    const a = document.createElement("a"); a.href = url; a.download = f.name.split("/").pop() || f.name; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllExtracted = async () => {
    const zip = new JSZip();
    for (const f of extracted) if (f.blob) zip.file(f.name, f.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "extracted.zip"; a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (mode === "create") addFiles(e.dataTransfer.files);
    else if (e.dataTransfer.files[0]?.name.endsWith(".zip")) extractZip(e.dataTransfer.files[0] as File);
  }, [mode, addFiles]);

  return (
    <ToolShell title="ZIP Creator & Extractor" description="Create ZIP archives with reorderable files, or extract ZIP archives — all in your browser using JSZip.">
      <div className="space-y-4">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(["create", "extract"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setFiles([]); setExtracted([]); setZipInfo(null); }}
              className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${mode === m ? "bg-blue-600 text-white font-medium" : "text-gray-400 hover:text-white"}`}
            >{m === "create" ? "Create ZIP" : "Extract ZIP"}</button>
          ))}
        </div>

        {mode === "create" ? (
          <div className="space-y-4">
            <div
              onDrop={onDrop} onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Archive size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400">Drop any files here or click to select</p>
              <p className="text-xs text-gray-600 mt-1">Images, docs, PDFs, videos, or any file format</p>
              <input ref={inputRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Files in Archive ({files.length}) · Drag or use ↑/↓ to reorder</span>
                    <button onClick={() => setFiles([])} className="hover:text-red-400 transition-colors">Clear all</button>
                  </div>
                  <DraggableList
                    items={files}
                    onReorder={setFiles}
                    onRemove={removeFile}
                    renderItem={(f) => (
                      <div className="flex items-center justify-between min-w-0 pr-2">
                        <div className="flex items-center gap-2 truncate">
                          <File size={14} className="text-blue-400 shrink-0" />
                          <span className="text-sm text-gray-200 truncate">{f.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-2">{formatBytes(f.size)}</span>
                      </div>
                    )}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input value={archiveName} onChange={e => setArchiveName(e.target.value)}
                    className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none"
                    placeholder="archive" />
                  <span className="text-gray-500 text-sm">.zip</span>
                  <button onClick={createZip} disabled={loading} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                    <Download size={14} />{loading ? "Creating..." : "Download ZIP"}
                  </button>
                </div>

                <p className="text-xs text-gray-600">
                  Total: {files.length} file{files.length !== 1 ? "s" : ""} · {formatBytes(files.reduce((a, f) => a + f.size, 0))}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onDrop={onDrop} onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => zipInputRef.current?.click()}
            >
              <FolderOpen size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400">Drop a .zip file here or click to select</p>
              <input ref={zipInputRef} type="file" accept=".zip" className="hidden" onChange={e => { if (e.target.files?.[0]) extractZip(e.target.files[0]); }} />
            </div>

            {loading && <div className="text-center text-gray-400 py-4">Extracting...</div>}

            {extracted.length > 0 && (
              <div className="space-y-3">
                {zipInfo && (
                  <div className="flex justify-between items-center text-xs text-gray-400 bg-white/5 rounded-xl p-3">
                    <span>{zipInfo.name}</span>
                    <span>{zipInfo.count} files · {formatBytes(zipInfo.originalSize)}</span>
                    <button onClick={downloadAllExtracted} className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                      <Download size={12} />Save All
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {extracted.map((f, i) => (
                    <div key={i} className="flex items-center justify-between glass rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <File size={14} className="text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-200 truncate">{f.name}</span>
                        <span className="text-xs text-gray-600 shrink-0">{formatBytes(f.size)}</span>
                      </div>
                      {f.blob && (
                        <button onClick={() => downloadFile(f)} className="text-blue-400 hover:text-blue-300 p-1">
                          <Download size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
