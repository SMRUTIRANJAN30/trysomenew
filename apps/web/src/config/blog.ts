export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  author: string;
  category: string;
  keywords: string[];
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-merge-pdf-files-without-adobe",
    title: "How to Merge PDF Files Without Adobe Acrobat or Uploads",
    description: "Learn how to combine multiple PDF files in seconds directly inside your web browser using WebAssembly. Free, private, and zero server storage.",
    date: "October 8, 2026",
    readTime: "4 min read",
    author: "Smrutiranjan Sahoo",
    category: "PDF Guides",
    keywords: ["merge pdf without adobe", "combine pdf files online free", "merge pdf in browser", "private pdf merger"],
    content: `
Merging multiple PDF documents into a single organized file used to require expensive desktop software like Adobe Acrobat Pro or uploading confidential documents to cloud portals.

Today, modern web browser standards like WebAssembly (WASM) allow full PDF parsing, page extraction, and lossless compilation directly in your computer memory.

### Why In-Browser PDF Merging is Safer

1. **Zero Server Storage**: Your files are never transmitted across the network or stored on third-party cloud disks.
2. **Instant Performance**: No waiting for multi-megabyte files to upload and re-download.
3. **Lossless Output**: Text streams and embedded vector assets remain crystal sharp.

### 3 Steps to Merge Your PDFs

1. Open the **[Merge PDF](/pdf/merge)** tool on trysomenew.
2. Drag and drop your PDF files into the workspace. Reorder pages as needed.
3. Click **Merge PDF Documents** and download your combined document instantly.
    `.trim(),
  },
  {
    slug: "how-to-extract-text-from-images-using-ocr",
    title: "How to Extract Text from Images & Scanned Invoices Using OCR",
    description: "Extract editable text from photos, receipts, and screenshots locally in your browser using optical character recognition without internet delays.",
    date: "October 5, 2026",
    readTime: "5 min read",
    author: "Smrutiranjan Sahoo",
    category: "OCR & AI",
    keywords: ["extract text from image", "image ocr online", "photo to text wasm", "free receipt ocr"],
    content: `
Optical Character Recognition (OCR) converts pixel patterns from scanned documents, photos, and smartphone receipts into clean, editable text.

Traditionally, OCR services sent your sensitive receipts and contracts to remote cloud servers. With client-side WebAssembly, high-accuracy recognition runs locally on your device CPU.

### Best Practices for High-Accuracy OCR

- Ensure good contrast between text and background.
- Keep scanned documents aligned and avoid heavy rotational skew.
- Upload high-resolution PNG or JPG images whenever possible.

Try the **[Image OCR](/ocr/image)** tool to extract text from your receipts in seconds.
    `.trim(),
  },
  {
    slug: "how-to-send-text-and-files-from-phone-to-pc",
    title: "How to Send Text, Links & Files from Phone to PC Instantly",
    description: "Discover Beam: the zero-setup, end-to-end encrypted live clipboard that pairs your phone and PC with a single QR scan.",
    date: "October 2, 2026",
    readTime: "4 min read",
    author: "Smrutiranjan Sahoo",
    category: "Productivity",
    keywords: ["send text from phone to pc", "online clipboard", "beam clipboard", "share link phone to laptop"],
    content: `
Most people still transfer links or snippets between their phone and computer by emailing themselves or creating single-person WhatsApp groups.

**Beam** changes this by providing an ephemeral, encrypted peer connection between devices:

- **Scan & Pair**: Scan the 220x220 QR code on your PC screen with your phone camera.
- **End-to-End Encryption**: Data is protected by 256-bit Web Crypto AES-GCM.
- **Auto-Expiry**: Sessions automatically vanish after 10 minutes of inactivity.

Open **[Beam Live Clipboard](/beam)** to start sharing links and snippets without signing in.
    `.trim(),
  },
];
