"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="resize"
      title="Resize Image"
      description="Change image width and height in pixels, with optional aspect-ratio lock. Works with JPG, PNG and WebP."
    />
  );
}
