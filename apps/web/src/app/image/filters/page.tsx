"use client";
import ImageStudio from "@/components/studio/ImageStudio";

export default function Page() {
  return (
    <ImageStudio
      initialTab="filters"
      title="Image Filters"
      description="Apply photo filters like grayscale, sepia, vivid, warm, cool and fade, with a live preview of each."
    />
  );
}
