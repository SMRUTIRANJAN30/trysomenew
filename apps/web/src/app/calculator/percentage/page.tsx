"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="percentage"
      title="Percentage Calculator"
      description="Find what percent one number is of another, percentage increase or decrease, and X% of any value."
    />
  );
}
