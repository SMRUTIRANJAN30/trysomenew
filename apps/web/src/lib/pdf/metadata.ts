import { PDFDocument } from "pdf-lib";

export interface PDFMetadataInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  producer?: string;
  creator?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  fileSizeBytes: number;
  dimensions?: {
    width: number;
    height: number;
    standardName?: string;
  };
}

/**
 * Extracts metadata and page geometry from a PDF document.
 */
export async function getPDFMetadata(buffer: ArrayBuffer): Promise<PDFMetadataInfo> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pageCount = doc.getPageCount();

  let dimensions: PDFMetadataInfo["dimensions"] = undefined;
  if (pageCount > 0) {
    const firstPage = doc.getPage(0);
    const { width, height } = firstPage.getSize();
    let standardName = "Custom";
    // Check standard paper dimensions (points, 72 pt = 1 inch)
    // A4: 595.28 x 841.89
    // Letter: 612 x 792
    if (Math.abs(width - 595.28) < 10 && Math.abs(height - 841.89) < 10) {
      standardName = "A4 (Portrait)";
    } else if (Math.abs(width - 841.89) < 10 && Math.abs(height - 595.28) < 10) {
      standardName = "A4 (Landscape)";
    } else if (Math.abs(width - 612) < 10 && Math.abs(height - 792) < 10) {
      standardName = "US Letter (Portrait)";
    } else if (Math.abs(width - 792) < 10 && Math.abs(height - 612) < 10) {
      standardName = "US Letter (Landscape)";
    }

    dimensions = {
      width: Math.round(width),
      height: Math.round(height),
      standardName,
    };
  }

  return {
    title: doc.getTitle() || undefined,
    author: doc.getAuthor() || undefined,
    subject: doc.getSubject() || undefined,
    keywords: doc.getKeywords()?.split(",").map(k => k.trim()).filter(Boolean),
    producer: doc.getProducer() || undefined,
    creator: doc.getCreator() || undefined,
    creationDate: doc.getCreationDate() ? doc.getCreationDate()?.toISOString() : undefined,
    modificationDate: doc.getModificationDate() ? doc.getModificationDate()?.toISOString() : undefined,
    pageCount,
    fileSizeBytes: buffer.byteLength,
    dimensions,
  };
}

/**
 * Updates metadata on a PDF document.
 */
export async function updatePDFMetadata(
  buffer: ArrayBuffer,
  updates: Partial<Pick<PDFMetadataInfo, "title" | "author" | "subject" | "creator">>
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  if (updates.title !== undefined) doc.setTitle(updates.title);
  if (updates.author !== undefined) doc.setAuthor(updates.author);
  if (updates.subject !== undefined) doc.setSubject(updates.subject);
  if (updates.creator !== undefined) doc.setCreator(updates.creator);

  doc.setModificationDate(new Date());

  return await doc.save({ useObjectStreams: true });
}
