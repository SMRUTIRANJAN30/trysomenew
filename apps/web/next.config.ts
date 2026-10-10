import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
  async rewrites() {
    return [
      { source: "/merge-pdf", destination: "/pdf/merge" },
      { source: "/split-pdf", destination: "/pdf/split" },
      { source: "/rotate-pdf", destination: "/pdf/rotate" },
      { source: "/compress-pdf", destination: "/pdf/compress" },
      { source: "/image-to-pdf", destination: "/image/to-pdf" },
      { source: "/jpg-to-pdf", destination: "/image/to-pdf" },
      { source: "/png-to-pdf", destination: "/image/to-pdf" },
      { source: "/pdf-to-jpg", destination: "/pdf/to-image" },
      { source: "/pdf-to-png", destination: "/pdf/to-image" },
      { source: "/pdf-redact", destination: "/pdf/redact" },
      { source: "/ocr-image", destination: "/ocr/image" },
      { source: "/ocr-pdf", destination: "/ocr/pdf" },
      { source: "/invoice-generator", destination: "/business/invoice" },
      { source: "/receipt-generator", destination: "/business/receipt" },
      { source: "/screen-recorder", destination: "/misc/screen-record" },
      { source: "/draw-signature", destination: "/sign/draw" },
      { source: "/type-signature", destination: "/sign/type" },
      { source: "/markdown-to-pdf", destination: "/convert/markdown-to-pdf" },
      { source: "/pdf-tools", destination: "/tools?category=pdf" },
      { source: "/image-tools", destination: "/tools?category=image" },
      { source: "/video-tools", destination: "/tools?category=video" },
      { source: "/developer-tools", destination: "/tools?category=developer" },
      { source: "/online-clipboard", destination: "/beam" },
      { source: "/send-text-from-phone-to-pc", destination: "/beam" },
      { source: "/transfer-files-phone-to-pc", destination: "/beam" },
    ];
  },
};

export default nextConfig;
