"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="convert"
      title="Image Converter"
      description="Convert images between JPG, PNG and WebP — including PNG to JPG, JPG to PNG and WebP to JPG."
    />
  );
}
