"use client";

const segments = [
  { value: "vse", label: "Všechna vozidla" },
  { value: "japonska", label: "Japonská auta" },
  { value: "seat-cupra", label: "Seat / Cupra" },
  { value: "elektro", label: "Elektroauta" },
  { value: "sportovni", label: "Sportovní" },
  { value: "ostatni", label: "Ostatní" },
] as const;

interface SegmentTabsProps {
  activeSegment: string;
  onSegmentChange: (segment: string) => void;
}

export default function SegmentTabs({ activeSegment, onSegmentChange }: SegmentTabsProps) {
  return (
    <div className="bg-dark">
      <div className="max-w-[1200px] mx-auto px-6">
        <nav
          className="flex gap-0 overflow-x-auto scrollbar-none -mx-6 px-6 md:mx-0 md:px-0"
          aria-label="Segmenty vozidel"
        >
          {segments.map((seg) => {
            const isActive = activeSegment === seg.value;
            return (
              <button
                key={seg.value}
                onClick={() => onSegmentChange(seg.value)}
                className={`whitespace-nowrap px-5 py-4 text-sm font-semibold transition-colors duration-200 border-b-2 shrink-0 ${
                  isActive
                    ? "border-blue text-white"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {seg.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
