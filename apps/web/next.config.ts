import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), clipboard-read=(self), clipboard-write=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  // Short, keyword-rich alias URLs permanently redirect to the one canonical page,
  // so Google consolidates ranking signals instead of seeing duplicate content.
  async redirects() {
    const aliases: [string, string][] = [
      ["/merge-pdf", "/pdf/merge"],
      ["/split-pdf", "/pdf/split"],
      ["/rotate-pdf", "/pdf/rotate"],
      ["/compress-pdf", "/pdf/compress"],
      ["/image-to-pdf", "/image/to-pdf"],
      ["/jpg-to-pdf", "/image/to-pdf"],
      ["/png-to-pdf", "/image/to-pdf"],
      ["/pdf-to-jpg", "/pdf/to-image"],
      ["/pdf-to-png", "/pdf/to-image"],
      ["/pdf-redact", "/pdf/redact"],
      ["/ocr-image", "/ocr/image"],
      ["/ocr-pdf", "/ocr/pdf"],
      ["/invoice-generator", "/business/invoice"],
      ["/receipt-generator", "/business/receipt"],
      ["/screen-recorder", "/misc/screen-record"],
      ["/draw-signature", "/sign/draw"],
      ["/type-signature", "/sign/type"],
      ["/markdown-to-pdf", "/convert/markdown-to-pdf"],
      ["/emi-calculator", "/calculator/emi"],
      ["/gst-calculator", "/calculator/gst"],
      ["/age-calculator", "/calculator/age"],
      ["/resize-image", "/image/resize"],
      ["/compress-image", "/image/compress"],
      ["/crop-image", "/image/crop"],
      ["/json-formatter", "/developer/json"],
      ["/qr-code-generator", "/qr/generator"],
      ["/word-counter", "/text/word-counter"],
      ["/video-tools", "/tools?category=video"],
      // Phone ↔ PC transfer now lives in Beam
      ["/online-clipboard", "/beam"],
      ["/send-text-from-phone-to-pc", "/beam"],
      ["/transfer-files-phone-to-pc", "/beam"],
      ["/clipboard", "/beam"],
      ["/transfer", "/beam"],
      // Retired pages
      ["/download", "/tools"],
      ["/media-downloader", "/tools"],
      ["/terabox-downloader", "/tools"],
      ["/youtube-downloader", "/tools"],
      ["/instagram-downloader", "/tools"],
      ["/tiktok-downloader", "/tools"],
      ["/roadmap", "/tools"],
      ["/developer-profile", "/about"],
      ["/developer/diff", "/text/diff"],
    ];
    return aliases.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async rewrites() {
    return [{ source: "/google92f69f2009533ddb.html", destination: "/api/google-verify" }];
  },
};

export default nextConfig;
