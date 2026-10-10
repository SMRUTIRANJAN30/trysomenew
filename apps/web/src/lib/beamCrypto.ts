/**
 * Web Crypto AES-GCM End-to-End Encryption Engine for Beam
 * Keys remain strictly on client devices (passed via URL #fragment or derived locally).
 */

const EMOJI_PALETTE = ["🌲", "🍂", "⚡", "🦊", "💎", "⚓", "🪐", "🍁", "🍄", "🍀", "🎯", "🦉", "🎨", "🚀", "🌊", "🔑"];

/**
 * Generates a random 6-character room code excluding ambiguous characters (0, O, 1, I, L)
 */
export function generateBeamCode(): string {
  const chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let result = "";
  const randomValues = new Uint8Array(6);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 6; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

/**
 * Generates a 4-emoji verification fingerprint for the visual match check on both devices
 */
export function generateEmojiMatchCheck(code: string): string[] {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0;
  }
  const emojis: string[] = [];
  for (let i = 0; i < 4; i++) {
    const idx = Math.abs((hash >> (i * 4)) % EMOJI_PALETTE.length);
    emojis.push(EMOJI_PALETTE[idx]);
  }
  return emojis;
}

/**
 * Generates a cryptographically strong 256-bit AES-GCM key
 */
export async function generateAesKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Exports CryptoKey to base64 string for URL fragment sharing
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/**
 * Imports base64 string into CryptoKey
 */
export async function importKeyFromBase64(base64: string): Promise<CryptoKey> {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return await crypto.subtle.importKey(
    "raw",
    bytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts UTF-8 plaintext with AES-GCM
 */
export async function encryptText(text: string, key: CryptoKey): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

/**
 * Decrypts AES-GCM ciphertext
 */
export async function decryptText(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  const cipherBytes = new Uint8Array(
    atob(ciphertext)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const ivBytes = new Uint8Array(
    atob(iv)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuffer);
}
