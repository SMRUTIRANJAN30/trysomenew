import { PDFDocument, PageSizes } from "pdf-lib";

export interface A4ConversionOptions {
  orientation?: "portrait" | "landscape" | "auto";
  fit?: "contain" | "fill";
  margin?: number; // points, default 0
}

// A4 dimensions in points: [595.28, 841.89]
export const A4_PORTRAIT: [number, number] = [595.28, 841.89];
export const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

/**
 * Standardizes all pages of a PDF to A4 dimensions.
 * Runs 100% locally in the browser with pdf-lib.
 */
export async function standardizePdfToA4(
  pdfBuffer: ArrayBuffer,
  options: A4ConversionOptions = {}
): Promise<Uint8Array> {
  const { orientation = "auto", fit = "contain", margin = 0 } = options;
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const pageCount = srcDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const srcPage = srcDoc.getPage(i);
    const { width: origWidth, height: origHeight } = srcPage.getSize();

    // Determine target dimensions
    let targetWidth: number;
    let targetHeight: number;

    if (orientation === "portrait") {
      targetWidth = A4_PORTRAIT[0];
      targetHeight = A4_PORTRAIT[1];
    } else if (orientation === "landscape") {
      targetWidth = A4_LANDSCAPE[0];
      targetHeight = A4_LANDSCAPE[1];
    } else {
      // auto: preserve aspect ratio orientation
      if (origWidth > origHeight) {
        targetWidth = A4_LANDSCAPE[0];
        targetHeight = A4_LANDSCAPE[1];
      } else {
        targetWidth = A4_PORTRAIT[0];
        targetHeight = A4_PORTRAIT[1];
      }
    }

    // Embed source page
    const [embeddedPage] = await newDoc.embedPages([srcPage]);

    // Available area after margins
    const usableWidth = targetWidth - margin * 2;
    const usableHeight = targetHeight - margin * 2;

    let scale = 1;
    let drawWidth = usableWidth;
    let drawHeight = usableHeight;
    let xOffset = margin;
    let yOffset = margin;

    if (fit === "contain") {
      const scaleX = usableWidth / origWidth;
      const scaleY = usableHeight / origHeight;
      scale = Math.min(scaleX, scaleY);

      drawWidth = origWidth * scale;
      drawHeight = origHeight * scale;

      // Center within target page
      xOffset = margin + (usableWidth - drawWidth) / 2;
      yOffset = margin + (usableHeight - drawHeight) / 2;
    }

    const page = newDoc.addPage([targetWidth, targetHeight]);
    page.drawPage(embeddedPage, {
      x: xOffset,
      y: yOffset,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return await newDoc.save();
}
