import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["600"],
  variable: "--font-heading",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://trysomenew.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "trysomenew — One Fast Workspace for Documents, Files & Devices",
    template: "%s | trysomenew",
  },
  description:
    "Fast, privacy-first all-in-one document workspace engineered by Smrutiranjan Sahoo. Merge, split, compress, redact PDFs, extract text via OCR, summarize documents, generate invoices, create digital signatures, sync clipboard, and transfer files across devices with zero server storage.",
  keywords: [
    "trysomenew",
    "pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "rotate pdf",
    "pdf redact",
    "pdf to jpg",
    "ocr pdf",
    "ocr image",
    "image to text",
    "ai pdf summarizer",
    "chat with pdf",
    "draw signature online",
    "typed signature generator",
    "free invoice generator pdf",
    "receipt generator",
    "screen recorder online",
    "text to speech tts",
    "speech to text transcribe",
    "ai notes generator",
    "flashcard generator",
    "quiz generator",
    "markdown to pdf",
    "pdf to txt",
    "document verification",
    "sha256",
    "online clipboard",
    "quicksend",
    "webrtc file transfer",
    "developer tools",
    "privacy-first pdf tools",
    "local-first workspace",
  ],
  authors: [{ name: "Smrutiranjan Sahoo", url: "https://trysomenew.com/about" }],
  creator: "Smrutiranjan Sahoo",
  publisher: "trysomenew",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "trysomenew — One Fast Workspace for Documents, Files & Devices",
    description:
      "Privacy-first, ultra-fast document workspace. 100% local client-side PDF tools, OCR extraction, AI summarizer, digital signatures, invoice generator, cryptographic SHA-256 verification, and encrypted device sync.",
    url: siteUrl,
    siteName: "trysomenew",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "trysomenew Workspace — Fast, Private Document Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "trysomenew — One Fast Workspace for Documents, Files & Devices",
    description:
      "Privacy-first document productivity workspace. Local-first PDF tools, OCR, AI document assistant, digital signatures, invoices, and instant P2P transfer.",
    images: ["/og-image.png"],
    creator: "@trysomenew",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "trysomenew",
  url: siteUrl,
  description:
    "Fast, privacy-first all-in-one document workspace. Merge, split, compress, redact PDFs, OCR text extractor, AI summarizer, digital signatures, invoices, SHA-256 verification, online clipboard, and P2P file transfer.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web Browser, iOS, Android, Windows, macOS, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Smrutiranjan Sahoo",
    url: "https://trysomenew.com/about",
  },
  featureList: [
    "Local-first PDF Merge, Split, Rotate, Compress, Image Rasterization & Redaction",
    "Client-side WebAssembly OCR for Scanned PDFs and Images",
    "Local AI Document Summarizer, Notes & Study Flashcards",
    "Interactive Document Chat & Quiz Generator",
    "Hand-drawn and Calligraphy Digital Signature Studio",
    "A4 PDF Invoice & Thermal Receipt Generator",
    "Browser Screen & System Audio Recorder",
    "Realtime Text-to-Speech & Speech Dictation Transcription",
    "Cryptographic SHA-256 file integrity verification & Document ID audit",
    "Realtime cross-device clipboard sync & P2P WebRTC file transfer",
    "Developer utilities, formatters, and code converters",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('trysomenew-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', saved);
                  if (saved === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${publicSans.variable} ${fraunces.variable} ${ibmPlexMono.variable} min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans antialiased transition-colors duration-150`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
