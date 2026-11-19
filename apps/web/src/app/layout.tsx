import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "trysomenew — Free Online PDF, Image & Developer Tools (No Upload)",
    template: "%s | trysomenew",
  },
  description:
    "Free, fast, privacy-first online tools: merge, split and compress PDFs, convert and resize images, OCR, QR codes, calculators, JSON and developer utilities. Everything runs in your browser — no upload, no sign-up.",
  applicationName: SITE_NAME,
  authors: [{ name: "Smrutiranjan Sahoo", url: `${SITE_URL}/about` }],
  creator: "Smrutiranjan Sahoo",
  publisher: SITE_NAME,
  // NOTE: no `alternates.canonical` here — it would be inherited by every page and
  // tell Google that all pages are duplicates of the homepage. Each page sets its own.
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "trysomenew — fast, private online tools" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }] },
  // The HTML-file verification (public/google92f69f2009533ddb.html) also stays in place.
  verification: { google: "YHrJsSDnt1l-728tmcUebnjKjgIaAzPesGqNdTOg0e8" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/app-icon.svg`,
    founder: { "@type": "Person", name: "Smrutiranjan Sahoo", url: `${SITE_URL}/about` },
  },
];

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
