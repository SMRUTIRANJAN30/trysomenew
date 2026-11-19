"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="compress"
      title="Compress Image"
      description="Shrink JPG, PNG and WebP files without visible quality loss. Pick a quality level and compare the size instantly."
    />
  );
}
