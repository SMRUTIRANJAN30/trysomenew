"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="watermark"
      title="Add Watermark to Image"
      description="Stamp text such as your name or © notice over a photo with adjustable opacity."
    />
  );
}
