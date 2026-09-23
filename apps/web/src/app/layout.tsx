import type { Metadata, Viewport } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "trysomenew — One Fast Workspace for Documents, Files & Devices",
  description:
    "Fast, privacy-first all-in-one document workspace engineered by Smrutiranjan Sahoo. Merge, split, rotate, compress PDFs, convert to image, verify cryptographic SHA-256 integrity, sync online clipboard, and transfer files across devices.",
  keywords: [
    "trysomenew",
    "pdf editor",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "rotate pdf",
    "pdf to jpg",
    "document verification",
    "sha256",
    "online clipboard",
    "quicksend",
    "webrtc file transfer",
  ],
  authors: [{ name: "Smrutiranjan Sahoo" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased transition-colors duration-200">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
