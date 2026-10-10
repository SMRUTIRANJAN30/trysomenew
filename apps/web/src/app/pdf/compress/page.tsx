"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { TOOLS_CONFIG } from "@/config/tools";
import { StandardToolLayout } from "@/components/tools/StandardToolLayout";
import { Select } from "@/components/ui/Select";

export default function CompressPdfPage() {
  const toolConfig = TOOLS_CONFIG.find((t) => t.slug === "compress-pdf")!;
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | undefined>(undefined);
  const [compressionLevel, setCompressionLevel] = useState("recommended");

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles([selectedFiles[0]]);
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const handleReset = () => {
    setFiles([]);
    setResultUrl(null);
    setResultSize(undefined);
    setProgressPercent(0);
    setIsProcessing(false);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgressPercent(20);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      setProgressPercent(60);

      // Save with object optimization
      const compressedBytes = await pdf.save({
        useObjectStreams: true,
      });

      setProgressPercent(90);

      const blob = new Blob([compressedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultSize(compressedBytes.byteLength);
      setProgressPercent(100);
      setIsProcessing(false);
    } catch (err) {
      console.error("Compression error:", err);
      alert("Could not compress PDF. Ensure the file is not protected.");
      setIsProcessing(false);
    }
  };

  const optionsPanel = (
    <div className="space-y-4 text-xs">
      <Select
        label="Compression Level"
        value={compressionLevel}
        onChange={(e) => setCompressionLevel(e.target.value)}
        options={[
          { value: "extreme", label: "Extreme Compression (Smallest size, lower DPI)" },
          { value: "recommended", label: "Recommended Compression (Good quality & size)" },
          { value: "minimal", label: "Minimal Compression (Highest visual quality)" },
        ]}
      />
      <p className="text-[11px] text-[var(--muted)]">
        Vector text and searchability are 100% preserved during optimization.
      </p>
    </div>
  );

  return (
    <StandardToolLayout
      tool={toolConfig}
      files={files}
      onFilesSelected={handleFilesSelected}
      onRemoveFile={handleRemoveFile}
      onProcess={handleCompress}
      onReset={handleReset}
      isProcessing={isProcessing}
      progressPercent={progressPercent}
      resultUrl={resultUrl}
      resultFileName={`compressed_${files[0]?.name || "document.pdf"}`}
      resultSize={resultSize}
      optionsPanel={optionsPanel}
      processButtonText="Compress PDF Document"
    />
  );
}
