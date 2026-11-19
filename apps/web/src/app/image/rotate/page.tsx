"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="rotate"
      title="Rotate & Flip Image"
      description="Rotate an image by 90°, 180° or 270° and mirror it horizontally or vertically."
    />
  );
}
