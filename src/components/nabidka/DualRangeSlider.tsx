"use client";

import { useCallback } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  formatValue: (value: number) => string;
}

export default function DualRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  formatValue,
}: DualRangeSliderProps) {
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      if (newMin <= valueMax) {
        onChange(newMin, valueMax);
      }
    },
    [valueMax, onChange],
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      if (newMax >= valueMin) {
        onChange(valueMin, newMax);
      }
    },
    [valueMin, onChange],
  );

  // Calculate fill bar position as percentage
  const leftPercent = ((valueMin - min) / (max - min)) * 100;
  const rightPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-text-muted mb-2">
        <span>{formatValue(valueMin)}</span>
        <span>{formatValue(valueMax)}</span>
      </div>
      <div className="dual-range">
        {/* Fill bar */}
        <div
          className="absolute h-full bg-blue rounded-[3px] top-0"
          style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="z-[3]"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="z-[4]"
        />
      </div>
    </div>
  );
}
