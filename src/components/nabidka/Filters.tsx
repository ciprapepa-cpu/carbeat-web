"use client";

import DualRangeSlider from "./DualRangeSlider";

const fuelOptions = ["Vše", "Benzín", "Nafta", "Hybrid", "Elektro", "CNG", "LPG"] as const;
const transOptions = ["Vše", "Manuální", "Automatická"] as const;
const driveOptions = ["Vše", "Předních kol", "Zadních kol", "4x4"] as const;
const bodyTypeOptions = ["Vše", "Kombi", "SUV", "Hatchback", "Sedan / limuzína", "Liftback", "Kabrio", "MPV", "Kupé", "VAN", "Ostatní"] as const;

export interface FiltersState {
  fuel: string;
  trans: string;
  drive: string;
  bodyType: string;
  yearFrom: number | null;
  yearTo: number | null;
  priceMin: number;
  priceMax: number;
  kmMin: number;
  kmMax: number;
  powerMin: number;
  powerMax: number;
}

export const defaultFilters: FiltersState = {
  fuel: "Vše",
  trans: "Vše",
  drive: "Vše",
  bodyType: "Vše",
  yearFrom: null,
  yearTo: null,
  priceMin: 0,
  priceMax: 1500000,
  kmMin: 0,
  kmMax: 300000,
  powerMin: 0,
  powerMax: 400,
};

interface FiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const czPrice = new Intl.NumberFormat("cs", { style: "decimal" });
const czKm = new Intl.NumberFormat("cs", { style: "decimal" });

function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 border ${
              value === opt
                ? "bg-blue !text-white border-blue"
                : "bg-surface text-text-muted border-border hover:border-blue hover:text-blue"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters({ filters, onChange }: FiltersProps) {
  const update = (patch: Partial<FiltersState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <aside className="space-y-6">
      <PillGroup label="Palivo" options={fuelOptions} value={filters.fuel} onChange={(fuel) => update({ fuel })} />
      <PillGroup label="Převodovka" options={transOptions} value={filters.trans} onChange={(trans) => update({ trans })} />
      <PillGroup label="Pohon" options={driveOptions} value={filters.drive} onChange={(drive) => update({ drive })} />
      <PillGroup label="Karoserie" options={bodyTypeOptions} value={filters.bodyType} onChange={(bodyType) => update({ bodyType })} />

      {/* Year */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Rok výroby
        </h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Od"
            value={filters.yearFrom ?? ""}
            onChange={(e) =>
              update({ yearFrom: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 rounded-[8px] border border-border bg-surface text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-blue transition-colors"
          />
          <input
            type="number"
            placeholder="Do"
            value={filters.yearTo ?? ""}
            onChange={(e) =>
              update({ yearTo: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full px-3 py-2 rounded-[8px] border border-border bg-surface text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-blue transition-colors"
          />
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Cena
        </h4>
        <DualRangeSlider
          min={0}
          max={1500000}
          step={50000}
          valueMin={filters.priceMin}
          valueMax={filters.priceMax}
          onChange={(priceMin, priceMax) => update({ priceMin, priceMax })}
          formatValue={(v) => `${czPrice.format(v)} Kč`}
        />
      </div>

      {/* Power range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Výkon
        </h4>
        <DualRangeSlider
          min={0}
          max={400}
          step={10}
          valueMin={filters.powerMin}
          valueMax={filters.powerMax}
          onChange={(powerMin, powerMax) => update({ powerMin, powerMax })}
          formatValue={(v) => `${v} kW`}
        />
      </div>

      {/* KM range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Nájezd
        </h4>
        <DualRangeSlider
          min={0}
          max={300000}
          step={5000}
          valueMin={filters.kmMin}
          valueMax={filters.kmMax}
          onChange={(kmMin, kmMax) => update({ kmMin, kmMax })}
          formatValue={(v) => `${czKm.format(v)} km`}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => onChange(filters)}
          className="w-full py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
        >
          Použít filtry
        </button>
        <button
          onClick={() => onChange(defaultFilters)}
          className="w-full py-2.5 rounded-[8px] text-sm font-semibold bg-transparent text-text-muted border-2 border-border transition-all duration-[250ms] hover:border-blue hover:text-blue"
        >
          Resetovat
        </button>
      </div>
    </aside>
  );
}
