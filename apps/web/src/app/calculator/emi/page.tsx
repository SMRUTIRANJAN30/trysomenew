"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="emi"
      title="EMI Calculator"
      description="Calculate the monthly EMI, total interest and total payment for a home, car or personal loan."
    />
  );
}
