/**
 * Real WebCrypto-based SHA-256 integrity and document verification engine.
 * Never fakes cryptographic checks. Computes true SHA-256 digests on ArrayBuffers.
 */

export interface VerificationRecord {
  id: string;
  name: string;
  hash: string;
  fileSizeBytes: number;
  mimeType: string;
  version: number;
  issuedAt: string;
  issuer: string;
  verified: boolean;
  notes?: string;
}

/**
 * Calculates SHA-256 hex digest of an ArrayBuffer using native browser WebCrypto API.
 */
export async function calculateSHA256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexString = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hexString;
}

/**
 * Generates an official DocNova / TrySomeNew verifiable Document ID.
 * Example: DOC-2026-F41A9B
 */
export function createDocumentId(): string {
  const year = new Date().getFullYear();
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `DOC-${year}-${hex}`;
}

const STORAGE_KEY = "trysomenew_verified_documents";

/**
 * Persists a verification record to the local cryptographic ledger (localStorage & memory).
 */
export function saveVerificationRecord(record: VerificationRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getVerificationRecords();
    const filtered = existing.filter(r => r.id !== record.id);
    filtered.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 100)));
  } catch (err) {
    console.warn("Could not save verification record to localStorage", err);
  }
}

/**
 * Retrieves all stored verification records.
 */
export function getVerificationRecords(): VerificationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Finds a verification record by Document ID.
 */
export function findVerificationRecordById(id: string): VerificationRecord | null {
  const records = getVerificationRecords();
  return records.find(r => r.id.toUpperCase() === id.toUpperCase()) || null;
}

/**
 * Authenticates a file's integrity against an expected SHA-256 hash.
 */
export async function verifyDocumentIntegrity(
  fileBuffer: ArrayBuffer,
  expectedHash: string
): Promise<{ matches: boolean; computedHash: string }> {
  const computedHash = await calculateSHA256(fileBuffer);
  const matches = computedHash.toLowerCase() === expectedHash.toLowerCase().trim();
  return { matches, computedHash };
}
