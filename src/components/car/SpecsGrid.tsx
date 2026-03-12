import type { ReactNode } from "react";

interface Spec {
  icon: ReactNode;
  label: string;
  value: string;
}

interface SpecsGridProps {
  specs: Spec[];
}

export default function SpecsGrid({ specs }: SpecsGridProps) {
  return (
    <div className="grid grid-cols-4 border border-border rounded-[20px] overflow-hidden max-xl:grid-cols-2 max-md:grid-cols-1">
      {specs.map((spec, index) => (
        <div
          key={index}
          className="flex items-center gap-3 py-4 px-[18px] border-b border-r border-border last:border-r-0 max-xl:[&:nth-child(2n)]:border-r-0 max-md:border-r-0"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-blue-light text-blue">
            {spec.icon}
          </span>
          <div>
            <p className="text-xs text-text-muted">{spec.label}</p>
            <p className="text-sm font-semibold text-text">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
