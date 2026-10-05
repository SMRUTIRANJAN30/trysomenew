import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "trysomenew — One Fast Workspace for Documents, Files & Devices",
    short_name: "trysomenew",
    description:
      "Privacy-first all-in-one document workspace. Merge, split, rotate, compress PDFs, verify SHA-256 integrity, sync online clipboard, and transfer files across devices.",
    start_url: "/",
    display: "standalone",
    background_color: "#060911",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
