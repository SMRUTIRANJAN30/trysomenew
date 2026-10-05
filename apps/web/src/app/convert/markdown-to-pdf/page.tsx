"use client";

import { useState } from "react";
import ToolShell from "@/components/tools/ToolShell";
import { Download, FileText, Sparkles, Check } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { marked } from "marked";

export default function MarkdownToPdfPage() {
  const [markdown, setMarkdown] = useState(`# Project Overview: trysomenew

## 1. Executive Summary
trysomenew is an ultra-fast, local-first document productivity workspace.

## 2. Key Pillars
- **Zero-Storage Privacy**: Operations run inside browser memory.
- **Cryptographic Ground Truth**: NIST-standard SHA-256 verification.
- **Cross-Device Fluidity**: Realtime clipboard sync & WebRTC QuickSend transfer.

## 3. Conclusion
Everything runs on client hardware with zero cloud latency.`);
  const [isConverting, setIsConverting] = useState(false);

  const convertToPdf = async () => {
    setIsConverting(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const lines = markdown.split("\n");
      let y = 790;

      for (const line of lines) {
        if (y < 60) break; // End of page
        const trimmed = line.trim();
        if (!trimmed) {
          y -= 12;
          continue;
        }

        if (trimmed.startsWith("# ")) {
          page.drawText(trimmed.replace("# ", "").slice(0, 50), {
            x: 50,
            y,
            size: 20,
            font: fontBold,
            color: rgb(0.08, 0.15, 0.3),
          });
          y -= 26;
        } else if (trimmed.startsWith("## ")) {
          page.drawText(trimmed.replace("## ", "").slice(0, 60), {
            x: 50,
            y,
            size: 14,
            font: fontBold,
            color: rgb(0.15, 0.3, 0.6),
          });
          y -= 20;
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.replace(/^[-*]\s+/, "");
          page.drawText("•", { x: 60, y, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
          page.drawText(bulletText.slice(0, 80), { x: 75, y, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
          y -= 16;
        } else {
          page.drawText(trimmed.slice(0, 90), {
            x: 50,
            y,
            size: 10,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
          });
          y -= 16;
        }
      }

      // Footer
      page.drawText("Rendered locally by trysomenew Markdown to PDF Engine", {
        x: 50,
        y: 35,
        size: 8,
        font: fontRegular,
        color: rgb(0.6, 0.6, 0.6),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolShell
      title="Markdown to PDF Converter (Phase 3)"
      description="Format and render standard Markdown notes and documentation into styled, downloadable A4 PDF documents."
      actions={
        <button
          onClick={convertToPdf}
          disabled={isConverting}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4"
        >
          <Download size={14} />
          {isConverting ? "Generating PDF..." : "Export as A4 PDF"}
        </button>
      }
    >
      <div className="space-y-6">
        <div className="glass rounded-2xl p-4">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full min-h-[420px] bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 font-mono text-xs text-[var(--foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="# Write your markdown here..."
          />
        </div>
      </div>
    </ToolShell>
  );
}
