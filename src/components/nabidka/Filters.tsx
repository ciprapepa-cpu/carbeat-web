"use client";

import DualRangeSlider from "./DualRangeSlider";

const fuelOptions = ["Vše", "Benzín", "Diesel", "Hybrid", "Elektro"] as const;
const transOptions = ["Vše", "Automat", "Manuál"] as const;

export interface FiltersState {
  fuel: string;
  trans: string;
  yearFrom: number | null;
  yearTo: number | null;
  priceMin: number;
  priceMax: number;
  kmMin: number;
  kmMax: number;
}

export const defaultFilters: FiltersState = {
  fuel: "Vše",
  trans: "Vše",
  yearFrom: null,
  yearTo: null,
  priceMin: 0,
  priceMax: 1500000,
  kmMin: 0,
  kmMax: 200000,
};

interface FiltersProps {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}

const czPrice = new Intl.NumberFormat("cs", { style: "decimal" });
const czKm = new Intl.NumberFormat("cs", { style: "decimal" });

export default function Filters({ filters, onChange }: FiltersProps) {
  const update = (patch: Partial<FiltersState>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <aside className="space-y-6">
      {/* Fuel */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Palivo
        </h4>
        <div className="flex flex-wrap gap-2">
          {fuelOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => update({ fuel: opt })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 border ${
                filters.fuel === opt
                  ? "bg-blue text-white border-blue"
                  : "bg-surface text-text-muted border-border hover:border-blue hover:text-blue"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Převodovka
        </h4>
        <div className="flex flex-wrap gap-2">
          {transOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => update({ trans: opt })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 border ${
                filters.trans === opt
                  ? "bg-blue text-white border-blue"
                  : "bg-surface text-text-muted border-border hover:border-blue hover:text-blue"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

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

      {/* KM range */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-[1.5px] text-text-muted mb-3">
          Nájezd
        </h4>
        <DualRangeSlider
          min={0}
          max={200000}
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
          className="w-full py-2.5 rounded-[8px] text-sm font-semibold bg-blue text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
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
