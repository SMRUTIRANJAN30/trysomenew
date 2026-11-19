"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="date"
      title="Date Difference Calculator"
      description="Count the days, weeks, months and years between two dates."
    />
  );
}
