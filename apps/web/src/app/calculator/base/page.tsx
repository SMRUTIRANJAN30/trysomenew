"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="base"
      title="Number Base Converter"
      description="Convert numbers between decimal, binary, hexadecimal and octal."
    />
  );
}
