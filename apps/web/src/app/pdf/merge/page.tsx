"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { TOOLS_CONFIG } from "@/config/tools";
import { StandardToolLayout } from "@/components/tools/StandardToolLayout";
import { Select } from "@/components/ui/Select";

export default function MergePdfPage() {
  const toolConfig = TOOLS_CONFIG.find((t) => t.slug === "merge-pdf")!;
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | undefined>(undefined);
  const [pageSize, setPageSize] = useState("original");

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
    setResultUrl(null);
    setResultSize(undefined);
    setProgressPercent(0);
    setIsProcessing(false);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setProgressPercent(15);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));

        const pct = 15 + Math.round(((i + 1) / files.length) * 75);
        setProgressPercent(pct);
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultSize(mergedBytes.byteLength);
      setProgressPercent(100);
      setIsProcessing(false);
    } catch (err) {
      console.error("Merge error:", err);
      alert("An error occurred while merging your PDF files. Please ensure files are not password-protected.");
      setIsProcessing(false);
    }
  };

  const optionsPanel = (
    <div className="space-y-4 text-xs">
      <Select
        label="Page Sizing"
        value={pageSize}
        onChange={(e) => setPageSize(e.target.value)}
        options={[
          { value: "original", label: "Keep Original Page Dimensions" },
          { value: "a4", label: "Standardize to A4 Size" },
          { value: "letter", label: "Standardize to US Letter" },
        ]}
      />
      <p className="text-[11px] text-[var(--muted)]">
        Files are merged in the order listed on the left.
      </p>
    </div>
  );

  return (
    <StandardToolLayout
      tool={toolConfig}
      files={files}
      onFilesSelected={handleFilesSelected}
      onRemoveFile={handleRemoveFile}
      onProcess={handleMerge}
      onReset={handleReset}
      isProcessing={isProcessing}
      progressPercent={progressPercent}
      resultUrl={resultUrl}
      resultFileName="merged_document.pdf"
      resultSize={resultSize}
      optionsPanel={optionsPanel}
      processButtonText="Merge PDF Documents"
    />
  );
}
