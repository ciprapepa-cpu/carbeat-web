"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CarWithPhotos, CarStatus } from "@/types/car";

type StatusFilter = "vse" | CarStatus;

const STATUS_LABELS: Record<CarStatus, string> = {
  koncept: "Koncept",
  pripravujeme: "Připravujeme",
  v_nabidce: "V nabídce",
  prodano: "Prodáno",
};

const STATUS_COLORS: Record<CarStatus, string> = {
  koncept: "bg-bg text-text-muted",
  pripravujeme: "bg-white text-[#d97706] border border-[#d97706]",
  v_nabidce: "bg-green-light text-green",
  prodano: "bg-bg text-text-muted",
};

interface CarListTableProps {
  cars: CarWithPhotos[];
}

export function CarListTable({ cars }: CarListTableProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("vse");

  const filtered = useMemo(() => {
    if (statusFilter === "vse") return cars;
    return cars.filter((c) => c.status === statusFilter);
  }, [cars, statusFilter]);

  // Count per status
  const counts = useMemo(() => {
    const c: Record<string, number> = { vse: cars.length };
    for (const car of cars) {
      c[car.status] = (c[car.status] ?? 0) + 1;
    }
    return c;
  }, [cars]);

  async function changeStatus(id: string, newStatus: CarStatus) {
    setUpdating(id);
    const res = await fetch(`/api/admin/cars/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      router.refresh();
    }
    setUpdating(null);
  }

  async function deleteCar(id: string, name: string) {
    if (!confirm(`Opravdu smazat "${name}"? Tato akce je nevratná.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
    setDeleting(null);
  }

  const statusFilterOptions: { value: StatusFilter; label: string }[] = [
    { value: "vse", label: "Vše" },
    { value: "v_nabidce", label: "V nabídce" },
    { value: "pripravujeme", label: "Připravujeme" },
    { value: "prodano", label: "Prodáno" },
    { value: "koncept", label: "Koncept" },
  ];

  if (cars.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-[12px] p-12 text-center">
        <p className="text-text-muted mb-4">Zatím žádná vozidla</p>
        <a
          href="/admin/auta/novy"
          className="inline-flex px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue"
        >
          + Přidat první vůz
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusFilterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-blue !text-white"
                : "bg-surface border border-border text-text-muted hover:text-text"
            }`}
          >
            {opt.label} ({counts[opt.value] ?? 0})
          </button>
        ))}
      </div>

    <div className="bg-surface border border-border rounded-[12px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Foto</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Název</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Segment</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Cena</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Stav</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Fotek</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Akce</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((car) => {
              const firstPhoto = car.car_photos
                ?.sort((a, b) => a.position - b.position)[0];
              const photoUrl = firstPhoto
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-photos/${firstPhoto.storage_path}`
                : null;

              return (
                <tr
                  key={car.id}
                  className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-16 h-10 rounded bg-bg overflow-hidden">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-text">{car.name}</div>
                    <div className="text-xs text-text-muted">/{car.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{car.segment}</td>
                  <td className="px-4 py-3 text-right font-medium text-text">
                    {car.price.toLocaleString("cs-CZ")} Kč
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={car.status}
                      onChange={(e) => changeStatus(car.id, e.target.value as CarStatus)}
                      disabled={updating === car.id}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue/30 ${STATUS_COLORS[car.status]}`}
                    >
                      {(Object.keys(STATUS_LABELS) as CarStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-text-muted">
                    {car.car_photos?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/auta/${car.id}/upravit`}
                        className="px-3 py-1.5 rounded-[6px] text-xs font-medium bg-bg text-text hover:bg-blue-light transition-colors"
                      >
                        Upravit
                      </a>
                      <button
                        onClick={() => deleteCar(car.id, car.name)}
                        disabled={deleting === car.id}
                        className="px-3 py-1.5 rounded-[6px] text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {deleting === car.id ? "..." : "Smazat"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
