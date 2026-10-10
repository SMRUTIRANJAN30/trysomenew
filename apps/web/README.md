# trysomenew — One Fast Workspace for Documents, Files & Devices

A fast, privacy-first all-in-one document and file workspace engineered with the **"Paper & Pine"** human-crafted design system. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

---

## 🌲 Design Direction: "Paper & Pine"

- **Visual Feel**: Calm, tangible workshop tool with warm paper backgrounds (`#F7F5F0`), deep pine branding (`#1F5F4A`), and a single terracotta action button (`#B8431F`).
- **Strict Anti-"AI Look" Rules**:
  - No purple/indigo gradients, no glassmorphism blur, no glow shadows.
  - Left-aligned editorial layouts without sparkles or stock illustrations.
  - Solid colors and crisp 1px borders.
  - Distinct radius tokens: `6px` inputs & buttons, `8px` cards, `12px` modals.
  - Typography: `Fraunces 600` for H1/H2 headings, `Public Sans` for UI/body text, and `IBM Plex Mono` for counters and codes.

---

## 📂 Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with Fraunces, Public Sans & Plex Mono
│   │   ├── globals.css         # Paper & Pine CSS variables & Tailwind tokens
│   │   ├── page.tsx            # Left-aligned workshop homepage
│   │   ├── beam/               # Signature live clipboard feature
│   │   ├── dashboard/          # Redesigned workspace hub with IBM Plex Mono stats
│   │   ├── tools/              # All 177+ tools directory
│   │   ├── pdf/                # PDF tools (merge, split, compress, redact...)
│   │   ├── image/              # Image tools (image-to-pdf, compress, resize...)
│   │   ├── blog/               # SEO How-to guides and tutorials
│   │   ├── ilovepdf-alternative/ # Comparative SEO landing page
│   │   ├── smallpdf-alternative/ # Comparative SEO landing page
│   │   ├── sitemap.ts          # Automated XML Sitemap generator
│   │   └── robots.ts           # Robots crawler configuration
│   ├── components/
│   │   ├── ui/                 # Reusable UI kit (Button, Input, Dropzone, Modal, etc.)
│   │   ├── layout/             # Header, MegaMenu, MobileNav, Footer, CommandPalette
│   │   ├── tools/              # StandardToolLayout unified template
│   │   └── common/             # Logo, ToolCard, DynamicIcon
│   ├── config/
│   │   ├── tools.ts            # Single source of truth for all tool configurations
│   │   └── blog.ts             # Editorial articles and guides
│   └── lib/
│       ├── beamCrypto.ts       # Web Crypto AES-GCM 256-bit encryption
│       ├── searchEngine.ts     # Sub-50ms instant fuzzy search with synonyms
│       └── seoHelper.ts        # JSON-LD schema generators
└── tests/
    └── engine.test.mjs         # Cryptographic and WebAssembly PDF test suite
```

---

## 🛠️ How to Add a New Tool in 2 Steps

### 1. Add Configuration in `src/config/tools.ts`
```typescript
{
  slug: "my-new-tool",
  name: "My New Tool",
  category: "pdf",
  shortDescription: "Description of what the tool does in one sentence.",
  keywords: ["keyword 1", "keyword 2"],
  faq: [
    { question: "Is it secure?", answer: "Yes, processed 100% locally in browser memory." }
  ],
  related: ["merge-pdf", "compress-pdf"],
  icon: "Wrench",
  href: "/pdf/my-new-tool",
  status: "ready",
  isLocal: true,
  inputExtensions: ["pdf"],
  outputExtensions: ["pdf"],
  maxFileSizeMB: 100,
}
```

### 2. Create Page in `src/app/pdf/my-new-tool/page.tsx`
```tsx
"use client";

import React, { useState } from "react";
import { TOOLS_CONFIG } from "@/config/tools";
import { StandardToolLayout } from "@/components/tools/StandardToolLayout";

export default function MyNewToolPage() {
  const tool = TOOLS_CONFIG.find((t) => t.slug === "my-new-tool")!;
  const [files, setFiles] = useState<File[]>([]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleProcess = async () => {
    // Process files locally using pdf-lib, canvas, or WebAssembly
  };

  return (
    <StandardToolLayout
      tool={tool}
      files={files}
      onFilesSelected={(newFiles) => setFiles(newFiles)}
      onRemoveFile={(idx) => setFiles(files.filter((_, i) => i !== idx))}
      onProcess={handleProcess}
      onReset={() => { setFiles([]); setResultUrl(null); }}
      resultUrl={resultUrl}
      processButtonText="Run Tool"
    />
  );
}
```

---

## 🚀 Deployment

The project builds standard static and serverless artifacts compatible with **Netlify**, **Vercel**, and **Cloudflare Pages**:

```bash
# Build production bundle
npm run build

# Run unit tests
npm test
```
