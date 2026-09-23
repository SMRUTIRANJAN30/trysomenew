# trysomenew — One Fast Workspace for Documents, Files & Devices

[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status)](https://trysomenew.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-emerald.svg)](#privacy-first-architecture)

> **"One fast workspace for documents, files and devices."**

**trysomenew** is an all-in-one, privacy-first, ultra-fast document productivity platform designed to replace fragmented legacy toolchains. Built with a local-first browser engine, it runs intensive document operations directly on client hardware with zero server uploads, true cryptographic SHA-256 verification, and seamless cross-device synchronization.

---

## 🌟 Key Features (Phase 1)

### 1. ⚡ Local-First PDF Toolbox
- **Merge PDF**: Combine multiple PDFs into a single file with drag-and-drop reordering.
- **Split & Extract**: Extract specific page ranges (e.g. `1-3, 5, 8`) or burst all pages into individual files bundled in a ZIP archive.
- **Rotate PDF**: Orient upside-down or sideways pages with live visual preview.
- **Compress PDF**: Optimize PDF object streams with preset levels (Recommended, Maximum, Light) and instant byte comparison.
- **PDF to JPG / PNG**: High-resolution client-side canvas rasterization with DPI selection (72, 150, 300 DPI) and ZIP packaging.
- **PDF Viewer & Metadata**: Inspect page counts, geometry dimensions (A4, Letter), and edit document headers (Title, Author, Subject).

### 2. 🛡️ Cryptographic Integrity Platform
- **True SHA-256 Verification**: Computes real binary digests via WebCrypto API.
- **Verifiable Document IDs**: Issues unique IDs (`DOC-2026-XXXXXX`) with timestamped receipts.
- **Tamper Audit**: Upload any file to verify if its bytes match an issued certificate. Zero fake checkmarks.

### 3. 📲 Cross-Device Fluidity
- **Online Clipboard**: Realtime text, snippet, and URL synchronization between desktop and mobile with ephemeral room codes and QR pairing.
- **QuickSend Transfer**: WebRTC P2P direct browser file transfer (up to 100 MB) without permanent cloud retention.

### 4. 🚀 Modern UX & Accessibility
- **Command Palette (`Ctrl / Cmd + K`)**: Instant keyboard fuzzy search across all tools.
- **Smart Uploader**: Drag & drop zone with automatic file type detection (PDF, DOCX, Images, Excel) and contextual action chips.
- **Accessible & Responsive**: Dark/light theme, mobile bottom navigation, reduced-motion compliance.

---

## 🏗️ Architecture

```
trysomenew/
├── apps/
│   ├── web/               # Next.js 16 App Router, TypeScript, Tailwind CSS
│   │   ├── src/app/       # Pages: /, /pdf/merge, /pdf/split, /verify, /clipboard, /transfer...
│   │   ├── src/lib/       # Core pdf-lib, canvas rasterizer, and WebCrypto engines
│   │   └── src/components # Accessible UI design system & Command Palette
│   │
│   ├── api/               # Python FastAPI backend
│   │   ├── app/main.py    # CORS, rate limiting, and middleware
│   │   └── app/routers/   # /health, /verify, /files, /signaling
│   │
│   └── worker/            # Background document conversion & cleanup tasks
│
├── netlify.toml           # Netlify zero-config deployment
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

### 3. Docker Compose (Full Stack)
```bash
docker-compose up --build
```

---

## 🔒 Privacy & Security Model

- **Zero-Storage for Local Operations**: All PDF merging, splitting, rotation, rasterization, and hash generation happen strictly in your browser memory.
- **Cryptographic Ground Truth**: Verification requires exact bitwise matches; tampering is mathematically proven.
- **Ephemeral Rooms**: Clipboard and file transfer sessions expire automatically after 24 hours of inactivity.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
