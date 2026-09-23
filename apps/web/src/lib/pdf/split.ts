import { PDFDocument } from "pdf-lib";

/**
 * Parses user range strings such as "1, 3-5, 8" into a 0-indexed array of page numbers.
 */
export function parsePageRangeString(rangeStr: string, maxPages: number): number[] {
  const result = new Set<number>();
  const parts = rangeStr.split(",").map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map(s => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(maxPages, Math.max(start, end));
        for (let i = from; i <= to; i++) {
          result.add(i - 1);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        result.add(page - 1);
      }
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

/**
 * Extracts specified pages from a PDF and returns a new PDF containing only those pages.
 * Runs 100% locally in browser memory.
 */
export async function extractPDFPages(
  sourceBuffer: ArrayBuffer,
  pageIndicesZeroIndexed: number[],
  onProgress?: (progress: number, status: string) => void
): Promise<Uint8Array> {
  if (pageIndicesZeroIndexed.length === 0) {
    throw new Error("No pages selected for extraction.");
  }

  onProgress?.(20, "Loading source document...");
  const sourceDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const totalPages = sourceDoc.getPageCount();

  // Validate indices
  const validIndices = pageIndicesZeroIndexed.filter(idx => idx >= 0 && idx < totalPages);
  if (validIndices.length === 0) {
    throw new Error("Selected page numbers are out of document range.");
  }

  onProgress?.(50, "Extracting selected pages...");
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(sourceDoc, validIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  onProgress?.(85, "Encoding extracted PDF...");
  const outputBytes = await newDoc.save({ useObjectStreams: true });
  onProgress?.(100, "Extraction complete!");

  return outputBytes;
}

/**
 * Splits a PDF into individual 1-page documents.
 */
export async function burstPDFToIndividualPages(
  sourceBuffer: ArrayBuffer,
  onProgress?: (progress: number, status: string) => void
): Promise<Array<{ pageNumber: number; bytes: Uint8Array }>> {
  onProgress?.(15, "Loading source document...");
  const sourceDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const total = sourceDoc.getPageCount();
  const results: Array<{ pageNumber: number; bytes: Uint8Array }> = [];

  for (let i = 0; i < total; i++) {
    onProgress?.(Math.round(20 + (i / total) * 70), `Splitting page ${i + 1} of ${total}...`);
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(sourceDoc, [i]);
    singleDoc.addPage(copiedPage);
    const bytes = await singleDoc.save({ useObjectStreams: true });
    results.push({ pageNumber: i + 1, bytes });
  }

  onProgress?.(100, "Burst split complete!");
  return results;
}
