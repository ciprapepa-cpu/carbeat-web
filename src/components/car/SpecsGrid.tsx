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
    <div className="detail-specs-grid">
      {specs.map((spec, index) => (
        <div key={index} className="detail-specs-grid__item">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-blue-light text-blue">
            {spec.icon}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-muted">{spec.label}</p>
            <p className="text-[15px] font-semibold text-text">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
