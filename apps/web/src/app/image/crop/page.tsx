"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="crop"
      title="Crop Image"
      description="Cut an image to an exact size or a ratio like 1:1, 4:3, 16:9 or 9:16 — perfect for profile pictures and posts."
    />
  );
}
