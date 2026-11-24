import { PDFDocument } from "pdf-lib";
import { getPdfJs, pdfJsAssets } from "./toImage";

export interface RedactArea {
  page: number; // 1-indexed
  x: number; // points from the left
  y: number; // points from the bottom
  width: number;
  height: number;
}

const DPI = 200;

/**
 * Real redaction. A black box drawn over a PDF leaves the hidden text in the file, so every page is turned into
 * a picture, the areas are painted onto the pixels, and a brand new PDF is built from those pictures. Nothing is
 * copied from the original, because links and form fields can pull a removed page's content along with them.
 */
export async function redactPdf(
  source: ArrayBuffer,
  areas: RedactArea[],
  onProgress?: (page: number, total: number) => void
): Promise<Uint8Array> {
  if (areas.length === 0) throw new Error("Add at least one area to redact.");
  for (const a of areas) {
    if (![a.page, a.x, a.y, a.width, a.height].every(Number.isFinite) || a.width <= 0 || a.height <= 0) {
      throw new Error("Every area needs a valid page, position, width and height.");
    }
  }

  const pdfjs = await getPdfJs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(source.slice(0)), ...pdfJsAssets(pdfjs.version) }).promise;
  if (areas.some((a) => !Number.isInteger(a.page) || a.page < 1 || a.page > doc.numPages)) {
    throw new Error(`Page numbers must be between 1 and ${doc.numPages}.`);
  }

  const out = await PDFDocument.create();
  for (let n = 1; n <= doc.numPages; n++) {
    onProgress?.(n, doc.numPages);
    const page = await doc.getPage(n);
    const size = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: DPI / 72 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser could not draw the page.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: ctx, viewport, intent: "print" }).promise;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000000";
    for (const a of areas.filter((r) => r.page === n)) {
      const [x1, y1] = viewport.convertToViewportPoint(a.x, a.y) as number[];
      const [x2, y2] = viewport.convertToViewportPoint(a.x + a.width, a.y + a.height) as number[];
      const left = Math.floor(Math.min(x1, x2)) - 1;
      const top = Math.floor(Math.min(y1, y2)) - 1;
      ctx.fillRect(left, top, Math.ceil(Math.max(x1, x2)) + 1 - left, Math.ceil(Math.max(y1, y2)) + 1 - top);
    }

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("This browser could not save the page."))), "image/jpeg", 0.92)
    );
    const image = await out.embedJpg(await blob.arrayBuffer());
    out.addPage([size.width, size.height]).drawImage(image, { x: 0, y: 0, width: size.width, height: size.height });
    canvas.width = canvas.height = 0;
  }
  return out.save();
}
