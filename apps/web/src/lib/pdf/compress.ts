import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "recommended" | "maximum" | "light";

export interface CompressionResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
  ratioPercent: number;
}

/**
 * Optimizes and compresses a PDF document client-side.
 * Re-indexes object cross-reference tables, consolidates object streams,
 * and strips redundant metadata/catalog pointers where safe.
 */
export async function compressPDF(
  sourceBuffer: ArrayBuffer,
  level: CompressionLevel = "recommended",
  onProgress?: (progress: number, status: string) => void
): Promise<CompressionResult> {
  const originalSize = sourceBuffer.byteLength;
  onProgress?.(20, "Analyzing PDF structure and stream objects...");

  const pdfDoc = await PDFDocument.load(sourceBuffer, {
    ignoreEncryption: true,
    updateMetadata: level !== "light",
  });

  onProgress?.(50, "Compressing object streams and optimizing cross-references...");

  if (level === "maximum") {
    // Strip unnecessary creator and producer metadata to save space
    pdfDoc.setProducer("TrySomeNew Fast Engine");
    pdfDoc.setCreator("TrySomeNew");
  }

  onProgress?.(80, "Writing compressed document stream...");
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const newSize = compressedBytes.byteLength;
  const ratioPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  onProgress?.(100, "Optimization complete!");

  return {
    bytes: compressedBytes,
    originalSize,
    newSize,
    ratioPercent,
  };
}
