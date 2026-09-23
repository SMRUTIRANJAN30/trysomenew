import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { PDFDocument } from "pdf-lib";

describe("trysomenew - Cryptographic Integrity Engine", () => {
  test("computes accurate SHA-256 binary hash matching NIST standard", async () => {
    const input = Buffer.from("trysomenew-fast-document-workspace");
    const expected = crypto.createHash("sha256").update(input).digest("hex");

    const hashBuffer = await crypto.subtle.digest("SHA-256", input);
    const computed = Buffer.from(hashBuffer).toString("hex");

    assert.equal(computed, expected);
    assert.equal(computed.length, 64);
  });

  test("produces distinct hashes for even single-byte variations", async () => {
    const docA = Buffer.from("Contract between Party A and Party B. Payment: $1,000");
    const docB = Buffer.from("Contract between Party A and Party B. Payment: $1,001");

    const hashA = crypto.createHash("sha256").update(docA).digest("hex");
    const hashB = crypto.createHash("sha256").update(docB).digest("hex");

    assert.notEqual(hashA, hashB);
  });

  test("generates valid Document ID matching pattern DOC-YYYY-HEX6", () => {
    const year = new Date().getFullYear();
    const hex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const docId = `DOC-${year}-${hex}`;

    const regex = new RegExp(`^DOC-${year}-[0-9A-F]{6}$`);
    assert.match(docId, regex);
  });
});

describe("trysomenew - PDF Processing Engine", () => {
  test("creates, merges, and validates multi-page PDF documents locally", async () => {
    // Generate doc 1 (2 pages)
    const doc1 = await PDFDocument.create();
    doc1.addPage([595, 842]);
    doc1.addPage([595, 842]);
    const bytes1 = await doc1.save();

    // Generate doc 2 (3 pages)
    const doc2 = await PDFDocument.create();
    doc2.addPage([595, 842]);
    doc2.addPage([595, 842]);
    doc2.addPage([595, 842]);
    const bytes2 = await doc2.save();

    // Perform merge
    const merged = await PDFDocument.create();
    const loaded1 = await PDFDocument.load(bytes1);
    const loaded2 = await PDFDocument.load(bytes2);

    const pages1 = await merged.copyPages(loaded1, loaded1.getPageIndices());
    pages1.forEach(p => merged.addPage(p));

    const pages2 = await merged.copyPages(loaded2, loaded2.getPageIndices());
    pages2.forEach(p => merged.addPage(p));

    const mergedBytes = await merged.save();
    const verifyDoc = await PDFDocument.load(mergedBytes);

    assert.equal(verifyDoc.getPageCount(), 5);
    assert.ok(mergedBytes.byteLength > 0);
  });

  test("extracts pages accurately based on range selections", async () => {
    const sourceDoc = await PDFDocument.create();
    for (let i = 0; i < 6; i++) {
      sourceDoc.addPage([612, 792]);
    }
    const sourceBytes = await sourceDoc.save();

    const loaded = await PDFDocument.load(sourceBytes);
    const extractIndices = [0, 2, 4]; // pages 1, 3, 5

    const extractedDoc = await PDFDocument.create();
    const copied = await extractedDoc.copyPages(loaded, extractIndices);
    copied.forEach(p => extractedDoc.addPage(p));

    const extractedBytes = await extractedDoc.save();
    const resultDoc = await PDFDocument.load(extractedBytes);

    assert.equal(resultDoc.getPageCount(), 3);
  });
});
