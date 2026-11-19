"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="gst"
      title="GST Calculator"
      description="Add or remove GST at 5%, 12%, 18% or 28% and see the tax amount, pre-tax price and final price instantly."
    />
  );
}
