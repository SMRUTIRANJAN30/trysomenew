# trysomenew — One Fast Workspace for Documents, Files & Devices

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status)](https://trysomenew.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-emerald.svg)](#privacy-first-architecture)

> **"One fast workspace for documents, files and devices."**

**trysomenew** is an all-in-one, privacy-first, ultra-fast document productivity platform designed to replace fragmented legacy toolchains. Built with a local-first browser engine, it runs intensive document operations directly on client hardware with zero server uploads, true cryptographic SHA-256 verification, and seamless cross-device synchronization.

---

## 🌟 Architectural Roadmap & Features

### 🟢 Phase 1: Local-First Core Foundations (Completed & Live)
1. **⚡ Local-First PDF Engine**:
   - **Merge PDF**: Combine multiple PDFs into a single file with drag-and-drop reordering.
   - **Split & Extract**: Extract specific page ranges or burst all pages into individual files bundled in a ZIP archive.
   - **Rotate PDF**: Orient upside-down or sideways pages with live visual preview.
   - **Compress PDF**: Optimize PDF object streams with preset levels (Recommended, Maximum, Light) and instant byte comparison.
   - **PDF to JPG / PNG**: High-resolution client-side canvas rasterization with DPI selection (72, 150, 300 DPI) and ZIP packaging.
   - **PDF Viewer & Metadata**: Inspect page counts, geometry dimensions (A4, Letter), and edit document headers (Title, Author, Subject).
2. **🛡️ Cryptographic Integrity Platform**:
   - **True SHA-256 Verification**: Computes real binary digests via WebCrypto API.
   - **Verifiable Document IDs**: Issues unique IDs (`DOC-2026-XXXXXX`) with timestamped receipts.
   - **Tamper Audit**: Upload any file to verify if its bytes match an issued certificate. Zero fake checkmarks.
3. **📲 Cross-Device Fluidity**:
   - **Online Clipboard**: Realtime text, snippet, and URL synchronization between desktop and mobile with ephemeral room codes and QR pairing.
   - **QuickSend Transfer**: WebRTC P2P direct browser file transfer (up to 100 MB) without permanent cloud retention.
4. **🚀 Modern UX & Accessibility**:
   - **Command Palette (`Ctrl / Cmd + K`)**: Instant keyboard fuzzy search across all tools.
   - **Smart Uploader**: Drag & drop zone with automatic file type detection and contextual action chips.

### 🟢 Phase 2: Developer & Productivity Expansion (Completed & Live)
1. **💻 Full Developer & Data Suite**:
   - **Code Formatters & Minifiers**: Beautifiers and minifiers for HTML, CSS, JavaScript, and formatted SQL queries.
   - **CSV Viewer & Table Inspector**: Interactive client-side tabular search and inspection.
   - **User-Agent Parser**: Instant breakdown of browser engines, operating systems, and device geometries.
   - **Data Converters**: JSON/YAML/XML converters, Base64, UUID, Cron parser, JWT decoder, Markdown editor, and Timestamp converter.
2. **🎨 Vector & SVG Studio**:
   - **SVG Viewer & Inspector**: Live markup previewer and source code exporter.
   - **SVG Optimizer & Minifier**: Strips XML comments, editor namespaces, and redundant attributes.
   - **SVG to PNG & PDF**: Canvas rasterizer with 1x to 8x resolution scaling.
   - **SVG to Data URI**: Instant generation of CSS `background-image` and HTML `<img>` strings.
3. **🔒 Security, Privacy & Design Tools**:
   - **Image EXIF Stripper**: 100% client-side stripping of GPS coordinates and camera serial numbers via HTML5 Canvas.
   - **Magic Byte & MIME Inspector**: Identifies authentic binary signatures and flags extension spoofing.
   - **Color Studio**: Color picker, WCAG AA/AAA contrast checker, and CSS gradient builder.
   - **QR & Barcode Suite**: Real scannable QR generator, camera/file QR scanner, and multi-format barcode generator.

### 🟢 Phase 3: WebAssembly, Local OCR & Advanced Intelligence (Completed & Live)
1. **🔍 Client-Side WebAssembly OCR**:
   - **OCR Image** (`/ocr/image`): Extract text from images/photos in-browser using WebAssembly & Canvas with TXT export.
   - **OCR Scanned PDF** (`/ocr/pdf`): Scan multi-page PDF documents and extract readable text locally.
2. **🤖 Local AI Intelligence Suite**:
   - **Document Summarizer** (`/ai/summarize`): Executive bullet points, reading metrics, and action items.
   - **Chat with PDF** (`/ai/chat`): Client-side conversational document Q&A assistant.
   - **AI Study Notes & Review** (`/ai/notes`): Auto-generate structured study notes and exam review sheets.
   - **AI Flashcards & Quiz Generator** (`/ai/flashcards`, `/ai/quiz`): 3D flip card active recall decks and multiple choice tests.
3. **🖋️ Digital Signature & PDF Redaction**:
   - **Draw Signature** (`/sign/draw`): Touch/mouse signature pad with smoothing, customizable stroke weight, and transparent PNG export.
   - **Calligraphy Type Signature** (`/sign/type`): Beautiful handwritten cursive signature generator.
   - **PDF Redaction** (`/pdf/redact`): Bitwise permanent black-out redaction using `pdf-lib` with zero trace of obscured text.
4. **💼 Business Document Suite**:
   - **Invoice Generator** (`/business/invoice`): Complete customizable A4 PDF invoice generator with multi-currency and line items.
   - **Receipt Generator** (`/business/receipt`): Professional thermal payment receipt generator.
5. **🎙️ Audio & Screen Recording Engine**:
   - **Speech to Text** (`/ai/transcribe`): Realtime microphone voice-to-text dictation.
   - **Text to Speech** (`/ai/tts`): Multi-voice, pitch-adjustable speech synthesis.
   - **In-Browser Screen Recorder** (`/misc/screen-record`): High-definition screen and audio recording to WebM/MP4.
6. **📄 Format Converters**:
   - **Markdown to PDF** (`/convert/markdown-to-pdf`): Styled A4 PDF generator from Markdown.
   - **PDF to TXT Stream** (`/convert/pdf-to-txt`): Rapid text stream extractor.

---

## ⚡ Performance & Search Engine Optimization (SEO)

- **Immutable Asset Caching**: Pre-configured Netlify headers with `Cache-Control: public, max-age=31536000, immutable` for static Next.js assets.
- **Dynamic Sitemap (`/sitemap.xml`)**: Automatic discovery and indexing of all live tools and pages with priority and change frequencies.
- **Robots.txt (`/robots.txt`)**: Search engine crawler rules pointing directly to the sitemap.
- **Schema.org JSON-LD**: Comprehensive `WebApplication` and `SoftwareApplication` structured metadata for Google Rich Results.
- **Social Media Meta Tags**: Dynamic Open Graph and Twitter Card tags with pre-rendered social preview assets (`/og-image.png`).
- **React 19 Zero-Jank Reconciliation**: Elimination of in-render component recreations and cascading re-renders for buttery-smooth 60fps interaction.

---

## 🏗️ Architecture

```
trysomenew/
├── apps/
│   ├── web/               # Next.js 16 App Router, TypeScript, Tailwind CSS
│   │   ├── src/app/       # Pages: /, /pdf/*, /color/*, /svg/*, /developer/*, /roadmap...
│   │   ├── src/lib/       # Core pdf-lib, canvas rasterizer, and WebCrypto engines
│   │   └── src/components # Accessible UI design system & Command Palette
│   │
│   ├── api/               # Python FastAPI backend
│   │   ├── app/main.py    # CORS, rate limiting, and middleware
│   │   └── app/routers/   # /health, /verify, /files, /signaling
│   │
│   └── worker/            # Background document conversion & cleanup tasks
│
├── netlify.toml           # Netlify zero-config deployment with API reverse proxy
├── docker-compose.yml     # Local multi-service cluster
└── .env.example           # Environment variables template
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v20 or v22+
- **npm**: v10+
- **Python**: 3.11+ (for backend API)

### 1. Run Frontend (Next.js)
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Backend (FastAPI)
```bash
cd apps/api
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🔒 Privacy & Security Model

- **Zero-Storage for Local Operations**: All PDF merging, splitting, rotation, rasterization, and hash generation happen strictly in your browser memory.
- **Cryptographic Ground Truth**: Verification requires exact bitwise matches; tampering is mathematically proven.
- **Ephemeral Rooms**: Clipboard and file transfer sessions expire automatically after 24 hours of inactivity.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
