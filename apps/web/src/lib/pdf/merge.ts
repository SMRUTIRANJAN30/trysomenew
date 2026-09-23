import { PDFDocument } from "pdf-lib";

export interface PDFSourceItem {
  id: string;
  name: string;
  size: number;
  buffer: ArrayBuffer;
  pageCount?: number;
}

/**
 * Inspects a PDF ArrayBuffer to get its page count and basic validity.
 */
export async function inspectPDF(buffer: ArrayBuffer): Promise<{ pageCount: number; isValid: boolean }> {
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return {
      pageCount: doc.getPageCount(),
      isValid: true,
    };
  } catch (err) {
    console.error("PDF inspection failed:", err);
    return {
      pageCount: 0,
      isValid: false,
    };
  }
}

/**
 * Merges multiple PDF ArrayBuffers in sequential order into a single PDF document.
 * Runs 100% locally in the browser with zero server transmission.
 */
export async function mergePDFs(
  items: PDFSourceItem[],
  onProgress?: (progress: number, status: string) => void
): Promise<Uint8Array> {
  if (items.length === 0) {
    throw new Error("No PDF documents provided to merge.");
  }

  onProgress?.(10, "Initializing merged document container...");
  const mergedPdf = await PDFDocument.create();

  const total = items.length;
  for (let i = 0; i < total; i++) {
    const item = items[i];
    onProgress?.(
      Math.round(15 + (i / total) * 70),
      `Merging ${item.name} (${i + 1} of ${total})...`
    );

    const sourceDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await mergedPdf.copyPages(sourceDoc, pageIndices);

    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }

  onProgress?.(90, "Optimizing and finalizing merged PDF...");
  const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
  onProgress?.(100, "Merge complete!");

  return mergedBytes;
}
