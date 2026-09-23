import JSZip from "jszip";

export interface RenderedPageImage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export interface ConvertToImageOptions {
  format: "png" | "jpeg";
  dpi: number; // e.g. 72 (standard), 150 (medium), 300 (high)
  quality?: number; // for jpeg: 0.1 to 1.0
  pagesToConvert?: number[]; // 1-indexed page numbers
}

/**
 * Dynamically loads pdfjs-dist and sets up the worker in a client-safe way.
 */
async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF rendering is only supported in browser environments.");
  }
  const pdfjs = await import("pdfjs-dist");
  // Set worker source to CDN matching installed major version
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

/**
 * Converts PDF pages to PNG or JPG images completely within the browser.
 */
export async function convertPdfToImages(
  pdfBuffer: ArrayBuffer,
  options: ConvertToImageOptions,
  onProgress?: (progress: number, status: string) => void
): Promise<RenderedPageImage[]> {
  onProgress?.(10, "Initializing PDF rendering engine...");
  const pdfjs = await getPdfJs();

  // Load document
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/",
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const targetPages = options.pagesToConvert?.length
    ? options.pagesToConvert.filter(p => p >= 1 && p <= totalPages)
    : Array.from({ length: totalPages }, (_, i) => i + 1);

  const scale = options.dpi / 72; // default PDF resolution is 72 DPI
  const results: RenderedPageImage[] = [];

  for (let i = 0; i < targetPages.length; i++) {
    const pageNum = targetPages[i];
    onProgress?.(
      Math.round(20 + (i / targetPages.length) * 70),
      `Rendering page ${pageNum} of ${totalPages} at ${options.dpi} DPI...`
    );

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not acquire 2D canvas context for rendering.");
    }

    // Fill white background for JPEGs
    if (options.format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({
      canvas,
      canvasContext: ctx,
      viewport,
      intent: "display",
    }).promise;

    const mimeType = options.format === "jpeg" ? "image/jpeg" : "image/png";
    const quality = options.quality ?? 0.92;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error("Canvas toBlob failed."))),
        mimeType,
        quality
      );
    });

    const dataUrl = canvas.toDataURL(mimeType, quality);

    results.push({
      pageNumber: pageNum,
      dataUrl,
      blob,
      width: viewport.width,
      height: viewport.height,
    });
  }

  onProgress?.(100, "Rendering complete!");
  return results;
}

/**
 * Packages multiple rendered images into a downloadable ZIP archive using JSZip.
 */
export async function packageImagesAsZip(
  images: RenderedPageImage[],
  baseFilename: string,
  format: "png" | "jpeg",
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, "Creating ZIP archive...");
  const zip = new JSZip();
  const cleanName = baseFilename.replace(/\.pdf$/i, "");

  for (const img of images) {
    const filename = `${cleanName}_page_${String(img.pageNumber).padStart(3, "0")}.${format === "jpeg" ? "jpg" : "png"}`;
    zip.file(filename, img.blob);
  }

  onProgress?.(70, "Compressing archive files...");
  const zipBlob = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    metadata => {
      onProgress?.(Math.round(70 + metadata.percent * 0.3), "Generating archive...");
    }
  );

  onProgress?.(100, "ZIP ready!");
  return zipBlob;
}
