"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="age"
      title="Age Calculator"
      description="Work out your exact age in years, months and days, and how many days until your next birthday."
    />
  );
}
