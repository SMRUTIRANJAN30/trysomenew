"use client";
import CalculatorStudio from "@/components/studio/CalculatorStudio";

export default function Page() {
  return (
    <CalculatorStudio
      initialTab="unit"
      title="Unit Converter"
      description="Convert length, weight, temperature, area and speed — metres to feet, kg to lb, °C to °F and more."
    />
  );
}
