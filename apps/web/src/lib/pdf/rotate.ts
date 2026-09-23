import { PDFDocument, degrees } from "pdf-lib";

export interface PageRotationSetting {
  pageIndex: number; // 0-indexed
  rotationDegrees: number; // 90, 180, 270, 360
}

/**
 * Rotates pages in a PDF document.
 * Can apply a uniform rotation to all pages, or individual rotations per page.
 */
export async function rotatePDFPages(
  sourceBuffer: ArrayBuffer,
  rotations: Map<number, number> | number, // either Map of pageIndex -> degrees, or a single number for all pages
  onProgress?: (progress: number, status: string) => void
): Promise<Uint8Array> {
  onProgress?.(20, "Loading PDF for rotation...");
  const pdfDoc = await PDFDocument.load(sourceBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const currentRotation = page.getRotation().angle;
    let addDegrees = 0;

    if (typeof rotations === "number") {
      addDegrees = rotations;
    } else if (rotations.has(i)) {
      addDegrees = rotations.get(i) || 0;
    }

    if (addDegrees !== 0) {
      const newAngle = (currentRotation + addDegrees) % 360;
      page.setRotation(degrees(newAngle));
    }
  }

  onProgress?.(80, "Saving rotated document...");
  const outputBytes = await pdfDoc.save({ useObjectStreams: true });
  onProgress?.(100, "Rotation complete!");

  return outputBytes;
}
