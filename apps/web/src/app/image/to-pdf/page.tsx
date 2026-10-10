"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { TOOLS_CONFIG } from "@/config/tools";
import { StandardToolLayout } from "@/components/tools/StandardToolLayout";
import { Select } from "@/components/ui/Select";

export default function ImageToPdfPage() {
  const toolConfig = TOOLS_CONFIG.find((t) => t.slug === "image-to-pdf")!;
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | undefined>(undefined);
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState("small");

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

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgressPercent(15);

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        let image;

        if (file.type.includes("png")) {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        // Standard A4 dimensions
        const a4Width = orientation === "portrait" ? 595.28 : 841.89;
        const a4Height = orientation === "portrait" ? 841.89 : 595.28;
        const marginPx = margin === "none" ? 0 : margin === "small" ? 20 : 40;

        const page = pdfDoc.addPage([a4Width, a4Height]);
        const availWidth = a4Width - marginPx * 2;
        const availHeight = a4Height - marginPx * 2;

        const imgScale = Math.min(availWidth / image.width, availHeight / image.height);
        const drawWidth = image.width * imgScale;
        const drawHeight = image.height * imgScale;

        page.drawImage(image, {
          x: marginPx + (availWidth - drawWidth) / 2,
          y: marginPx + (availHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });

        const pct = 15 + Math.round(((i + 1) / files.length) * 75);
        setProgressPercent(pct);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setResultSize(pdfBytes.byteLength);
      setProgressPercent(100);
      setIsProcessing(false);
    } catch (err) {
      console.error("Image to PDF error:", err);
      alert("Failed to convert images. Please ensure files are valid JPG or PNG images.");
      setIsProcessing(false);
    }
  };

  const optionsPanel = (
    <div className="space-y-4 text-xs">
      <Select
        label="Page Orientation"
        value={orientation}
        onChange={(e) => setOrientation(e.target.value)}
        options={[
          { value: "portrait", label: "Portrait (Standard A4)" },
          { value: "landscape", label: "Landscape (Horizontal A4)" },
        ]}
      />

      <Select
        label="Page Margins"
        value={margin}
        onChange={(e) => setMargin(e.target.value)}
        options={[
          { value: "none", label: "No Margin (Full Bleed)" },
          { value: "small", label: "Small Margin (Clean Border)" },
          { value: "large", label: "Large Margin (Framed)" },
        ]}
      />
    </div>
  );

  return (
    <StandardToolLayout
      tool={toolConfig}
      files={files}
      onFilesSelected={handleFilesSelected}
      onRemoveFile={handleRemoveFile}
      onProcess={handleConvert}
      onReset={handleReset}
      isProcessing={isProcessing}
      progressPercent={progressPercent}
      resultUrl={resultUrl}
      resultFileName="converted_images.pdf"
      resultSize={resultSize}
      optionsPanel={optionsPanel}
      processButtonText="Convert to PDF"
    />
  );
}
