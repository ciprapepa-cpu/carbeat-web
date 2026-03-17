"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { CAR_SEGMENTS, CAR_STATUSES } from "@/lib/validations/car";
import type { CarWithPhotos, CarPhoto, CarSegment, CarStatus } from "@/types/car";

const SEGMENT_LABELS: Record<string, string> = {
  japonska: "Japonská",
  "seat-cupra": "Seat / Cupra",
  elektro: "Elektro",
  sportovni: "Sportovní",
  ostatni: "Ostatní",
};

const EQUIPMENT_CATEGORIES = ["Komfort", "Bezpečnost", "Exteriér", "Interiér", "Ostatní"];

const STATUS_LABELS: Record<CarStatus, string> = {
  koncept: "Koncept — skryté",
  pripravujeme: "Připravujeme — zjednodušená karta",
  v_nabidce: "V nabídce — plně viditelné",
  prodano: "Prodáno — v sekci prodané",
};

const FUEL_OPTIONS = ["Benzín", "Nafta", "Hybrid", "Elektro", "CNG", "LPG"];
const BODY_TYPE_OPTIONS = ["Kombi", "SUV", "Hatchback", "Sedan / limuzína", "Liftback", "Kabrio", "MPV", "Kupé", "VAN", "Ostatní"];
const DRIVE_OPTIONS = ["Předních kol", "Zadních kol", "4x4"];
const TRANSMISSION_OPTIONS = ["Manuální", "Automatická"];

interface CarFormProps {
  car?: CarWithPhotos;
  mode: "create" | "edit";
}

export function CarForm({ car, mode }: CarFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Basic info
  const [name, setName] = useState(car?.name ?? "");
  const [slug, setSlug] = useState(car?.slug ?? "");
  const [price, setPrice] = useState(car?.price ?? 0);
  const [description, setDescription] = useState(car?.description ?? "");

  // Params
  const [year, setYear] = useState(car?.year ?? new Date().getFullYear());
  const [km, setKm] = useState(car?.km ?? 0);
  const [powerKw, setPowerKw] = useState(car?.power_kw ?? 0);
  const [fuel, setFuel] = useState(car?.fuel ?? "Benzín");
  const [engine, setEngine] = useState(car?.engine ?? "");
  const [transmission, setTransmission] = useState(car?.transmission ?? "");
  const [transmissionType, setTransmissionType] = useState(car?.transmission_type ?? "Manuální");
  const [drive, setDrive] = useState(car?.drive ?? "Předních kol");
  const [bodyType, setBodyType] = useState(car?.body_type ?? "Sedan / limuzína");

  // Category
  const [segment, setSegment] = useState<CarSegment>(car?.segment ?? "ostatni");
  const [categoryLabel, setCategoryLabel] = useState(car?.category_label ?? "");

  // Badges & Defects
  const [badges, setBadges] = useState<string[]>(car?.badges ?? ["Cebia"]);
  const [newBadge, setNewBadge] = useState("");
  const [defects, setDefects] = useState<string[]>(car?.defects ?? []);
  const [newDefect, setNewDefect] = useState("");

  // Equipment
  const [equipment, setEquipment] = useState<Record<string, string[]>>(
    car?.equipment ?? Object.fromEntries(EQUIPMENT_CATEGORIES.map((c) => [c, []]))
  );
  const [equipmentText, setEquipmentText] = useState<Record<string, string>>({});

  // Photos
  const [photos, setPhotos] = useState<CarPhoto[]>(
    car?.car_photos?.sort((a, b) => a.position - b.position) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<number | null>(null);

  // YouTube
  const [youtubeUrl, setYoutubeUrl] = useState(car?.youtube_url ?? "");

  // Publish
  const [status, setStatus] = useState<CarStatus>(car?.status ?? "koncept");
  const [sortOrder, setSortOrder] = useState(car?.sort_order ?? 0);

  // Form state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slug from name
  function handleNameChange(value: string) {
    setName(value);
    if (!car) {
      setSlug(slugify(value));
    }
  }

  // Badges
  function addBadge() {
    const trimmed = newBadge.trim();
    if (trimmed && !badges.includes(trimmed)) {
      setBadges([...badges, trimmed]);
      setNewBadge("");
    }
  }

  function removeBadge(badge: string) {
    setBadges(badges.filter((b) => b !== badge));
  }

  // Defects
  function addDefect() {
    const trimmed = newDefect.trim();
    if (trimmed && !defects.includes(trimmed)) {
      setDefects([...defects, trimmed]);
      setNewDefect("");
    }
  }

  function removeDefect(defect: string) {
    setDefects(defects.filter((d) => d !== defect));
  }

  // Equipment — parse semicolons and add all items at once
  function addEquipmentItems(category: string) {
    const text = equipmentText[category]?.trim();
    if (!text) return;
    const items = text
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const existing = equipment[category] ?? [];
    const newItems = items.filter((item) => !existing.includes(item));
    if (newItems.length > 0) {
      setEquipment({ ...equipment, [category]: [...existing, ...newItems] });
    }
    setEquipmentText({ ...equipmentText, [category]: "" });
  }

  function removeEquipmentItem(category: string, item: string) {
    setEquipment({
      ...equipment,
      [category]: (equipment[category] ?? []).filter((i) => i !== item),
    });
  }

  // Photos — resize on client before upload (max 1920px, JPEG 85%)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function resizeImage(file: File, maxWidth: number, quality: number): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Skip resize if already small enough
        if (img.width <= maxWidth && file.size < 2 * 1024 * 1024) {
          resolve(file);
          return;
        }

        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resized = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
                type: "image/jpeg",
              });
              resolve(resized);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files || files.length === 0 || !car?.id) return;

    const fileArray = Array.from(files);
    setUploading(true);
    setUploadError(null);

    let uploaded = 0;
    const errors: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      setUploadStatus(`Nahrávám ${i + 1}/${fileArray.length}...`);

      try {
        // Resize on client — max 1920px, 85% JPEG quality
        const resized = await resizeImage(fileArray[i], 1920, 0.85);

        const formData = new FormData();
        formData.append("photos", resized);

        const res = await fetch(`/api/admin/cars/${car.id}/photos`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          if (result.errors?.length > 0) {
            errors.push(...result.errors);
          } else {
            uploaded++;
          }
        } else {
          let errMsg = `${fileArray[i].name}: chyba (${res.status})`;
          try {
            const errData = await res.json();
            errMsg = errData.error || errMsg;
          } catch { /* not JSON */ }
          errors.push(errMsg);
        }
      } catch (err) {
        errors.push(`${fileArray[i].name}: ${err instanceof Error ? err.message : "chyba"}`);
      }
    }

    // Refresh photos from server
    try {
      const carRes = await fetch(`/api/admin/cars/${car.id}`);
      if (carRes.ok) {
        const updatedCar = await carRes.json();
        setPhotos(
          (updatedCar.car_photos as CarPhoto[]).sort((a, b) => a.position - b.position)
        );
      }
    } catch { /* ignore refresh error */ }

    if (errors.length > 0) {
      setUploadError(errors.join("\n"));
    }

    if (uploaded > 0) {
      setUploadStatus(`Nahráno ${uploaded} ${uploaded === 1 ? "fotka" : uploaded <= 4 ? "fotky" : "fotek"}`);
      setTimeout(() => setUploadStatus(null), 3000);
    } else {
      setUploadStatus(null);
    }

    setUploading(false);
  }

  // Photos — delete
  async function deletePhoto(photoId: string) {
    if (!car?.id) return;
    const res = await fetch(`/api/admin/cars/${car.id}/photos?photoId=${photoId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPhotos(photos.filter((p) => p.id !== photoId));
    }
  }

  // Photos — drag reorder
  const handleDragStart = useCallback((index: number) => {
    dragItemRef.current = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    async (index: number) => {
      const fromIndex = dragItemRef.current;
      if (fromIndex === null || fromIndex === index) {
        setDragOverIndex(null);
        return;
      }

      const updated = [...photos];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(index, 0, moved);

      const reordered = updated.map((p, i) => ({ ...p, position: i }));
      setPhotos(reordered);
      setDragOverIndex(null);
      dragItemRef.current = null;

      if (car?.id) {
        await fetch(`/api/admin/cars/${car.id}/photos`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: reordered.map((p) => ({ id: p.id, position: p.position })),
          }),
        });
      }
    },
    [photos, car?.id]
  );

  // Auto-generate SEO
  function generateMeta() {
    const metaTitle = `${name} | CarBeat`;
    const metaDesc = [
      name,
      year ? `rok ${year}` : "",
      km ? `${km.toLocaleString("cs-CZ")} km` : "",
      powerKw ? `${powerKw} kW` : "",
      fuel,
      transmissionType,
      price ? `${price.toLocaleString("cs-CZ")} Kč` : "",
    ]
      .filter(Boolean)
      .join(", ");
    return {
      meta_title: metaTitle,
      meta_description: `${metaDesc}. Prověřený vůz dovezený z Německa s Cebia certifikátem.`,
    };
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const seo = generateMeta();

    const body = {
      name,
      slug,
      segment,
      category_label: categoryLabel,
      year,
      km,
      power_kw: powerKw,
      fuel,
      engine,
      transmission,
      transmission_type: transmissionType,
      drive,
      body_type: bodyType,
      price,
      description: description || null,
      defects,
      badges,
      youtube_url: youtubeUrl || null,
      equipment,
      status,
      is_published: status === "v_nabidce",
      sort_order: sortOrder,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
    };

    const url =
      mode === "create" ? "/api/admin/cars" : `/api/admin/cars/${car!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Nastala chyba při ukládání");
      setSaving(false);
      return;
    }

    const savedCar = await res.json();

    if (mode === "create") {
      router.push(`/admin/auta/${savedCar.id}/upravit`);
    } else {
      router.refresh();
      setSaving(false);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] px-4 py-3 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Section: Základní info */}
      <Section title="Základní info">
        <Field label="Název vozu">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="Mercedes-Benz C43 AMG"
          />
        </Field>
        <Field label="Cena (Kč)">
          <input
            type="number"
            required
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={inputClass}
            placeholder="749900"
          />
        </Field>
        <Field label="Popis">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} min-h-[120px] resize-y`}
            placeholder="Detailní popis vozu..."
          />
        </Field>
      </Section>

      {/* Section: Parametry */}
      <Section title="Parametry">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rok">
            <input type="number" required value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label="Najeto (km)">
            <input type="number" required value={km || ""} onChange={(e) => setKm(Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label="Výkon (kW)">
            <input type="number" required value={powerKw || ""} onChange={(e) => setPowerKw(Number(e.target.value))} className={inputClass} />
          </Field>
          <Field label="Palivo">
            <select value={fuel} onChange={(e) => setFuel(e.target.value)} className={inputClass}>
              {FUEL_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
          <Field label="Motor">
            <input type="text" value={engine} onChange={(e) => setEngine(e.target.value)} className={inputClass} placeholder="3.0 V6 Biturbo" />
          </Field>
          <Field label="Převodovka (název)">
            <input type="text" value={transmission} onChange={(e) => setTransmission(e.target.value)} className={inputClass} placeholder="9G-Tronic" />
          </Field>
          <Field label="Typ převodovky">
            <select value={transmissionType} onChange={(e) => setTransmissionType(e.target.value)} className={inputClass}>
              {TRANSMISSION_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Pohon">
            <select value={drive} onChange={(e) => setDrive(e.target.value)} className={inputClass}>
              {DRIVE_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Karoserie">
            <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className={inputClass}>
              {BODY_TYPE_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Section: Kategorie */}
      <Section title="Kategorie">
        <Field label="Segment">
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value as CarSegment)}
            className={inputClass}
          >
            {CAR_SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {SEGMENT_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kategorie (štítek)">
          <input
            type="text"
            value={categoryLabel}
            onChange={(e) => setCategoryLabel(e.target.value)}
            className={inputClass}
            placeholder="Sportovní sedan"
          />
        </Field>
      </Section>

      {/* Section: Odznaky */}
      <Section title="Odznaky (badges)">
        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                badge === "Cebia"
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-blue/10 text-blue"
              }`}
            >
              {badge}
              <button
                type="button"
                onClick={() => removeBadge(badge)}
                className="ml-1 text-current opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBadge}
            onChange={(e) => setNewBadge(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addBadge();
              }
            }}
            className={inputClass}
            placeholder="Nový odznak..."
          />
          <button type="button" onClick={addBadge} className={btnSecondary}>
            Přidat
          </button>
        </div>
      </Section>

      {/* Section: Závady */}
      <Section title="Závady">
        <div className="flex flex-wrap gap-2 mb-3">
          {defects.map((defect) => (
            <span
              key={defect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/10 text-red-500"
            >
              {defect}
              <button
                type="button"
                onClick={() => removeDefect(defect)}
                className="ml-1 text-current opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newDefect}
            onChange={(e) => setNewDefect(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addDefect();
              }
            }}
            className={inputClass}
            placeholder="Nová závada..."
          />
          <button type="button" onClick={addDefect} className={btnSecondary}>
            Přidat
          </button>
        </div>
      </Section>

      {/* Section: Výbava */}
      <Section title="Výbava">
        <p className="text-xs text-text-muted mb-4">
          Položky oddělujte středníkem (;). Např.: Kožené sedačky; Vyhřívaná sedadla; Tempomat
        </p>
        {EQUIPMENT_CATEGORIES.map((category) => (
          <div key={category} className="mb-6 last:mb-0">
            <h4 className="text-sm font-semibold text-text mb-2">{category}</h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(equipment[category] ?? []).map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-bg text-text-muted"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeEquipmentItem(category, item)}
                    className="ml-0.5 opacity-60 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={equipmentText[category] ?? ""}
                onChange={(e) =>
                  setEquipmentText({
                    ...equipmentText,
                    [category]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEquipmentItems(category);
                  }
                }}
                className={`${inputClass} text-sm`}
                placeholder={`Položky oddělené středníkem...`}
              />
              <button
                type="button"
                onClick={() => addEquipmentItems(category)}
                className={btnSecondary}
              >
                Přidat
              </button>
            </div>
          </div>
        ))}
      </Section>

      {/* Section: Fotografie */}
      <Section title={`Fotografie${photos.length > 0 ? ` (${photos.length})` : ""}`}>
        {mode === "create" ? (
          <p className="text-sm text-text-muted">
            Fotky lze nahrát po uložení vozu. Nejdříve vyplňte formulář a klikněte na „Vytvořit vůz".
          </p>
        ) : (
          <>
            {photos.length > 0 && (
              <p className="text-xs text-text-muted mb-3">
                Přetáhněte fotky pro změnu pořadí. První fotka = hlavní foto na kartě vozu.
              </p>
            )}

            {photos.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => setDragOverIndex(null)}
                    className={`relative group aspect-[4/3] rounded-[8px] overflow-hidden bg-bg cursor-grab active:cursor-grabbing transition-all ${
                      dragOverIndex === index
                        ? "ring-2 ring-blue scale-105"
                        : index === 0
                          ? "ring-2 ring-green"
                          : "border-2 border-transparent hover:border-border"
                    }`}
                  >
                    <img
                      src={`${supabaseUrl}/storage/v1/object/public/car-photos/${photo.storage_path}`}
                      alt={photo.alt_text || `Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => deletePhoto(photo.id)}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-red-500 text-white rounded text-xs font-medium transition-opacity"
                      >
                        Smazat
                      </button>
                    </div>
                    {index === 0 ? (
                      <span className="absolute top-1 left-1 bg-green text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                        Hlavní
                      </span>
                    ) : (
                      <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-[12px] p-8 text-center mb-4">
                <p className="text-text-muted text-sm">Zatím žádné fotky</p>
              </div>
            )}

            {/* Upload status */}
            {uploadStatus && (
              <p className="text-sm text-blue font-medium mb-2">{uploadStatus}</p>
            )}
            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2 text-red-500 text-xs mb-2 whitespace-pre-line">
                {uploadError}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`${btnSecondary} ${uploading ? "animate-pulse" : ""}`}
            >
              {uploading ? "Nahrávám..." : "+ Nahrát fotky"}
            </button>
          </>
        )}
      </Section>

      {/* Section: YouTube */}
      <Section title="YouTube">
        <Field label="URL videa">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
      </Section>

      {/* Section: Stav & Publikace */}
      <Section title="Stav & Publikace">
        <Field label="Stav vozu">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CarStatus)}
            className={inputClass}
          >
            {CAR_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pořadí řazení">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={`${inputClass} max-w-[120px]`}
          />
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover disabled:opacity-50"
        >
          {saving ? "Ukládám..." : mode === "create" ? "Vytvořit vůz" : "Uložit změny"}
        </button>
        <a
          href="/admin"
          className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          Zpět
        </a>
        {mode === "edit" && saving === false && (
          <span className="text-xs text-text-muted ml-auto">
            Uloženo
          </span>
        )}
      </div>
    </form>
  );
}

// Shared styles
const inputClass =
  "w-full px-3 py-2 rounded-[8px] border border-border bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue/40 transition-colors";

const btnSecondary =
  "px-4 py-2 rounded-[8px] text-sm font-medium bg-bg border border-border text-text hover:bg-blue-light transition-colors whitespace-nowrap";

// Helper components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface border border-border rounded-[12px] p-6">
      <h3 className="text-base font-semibold text-text mb-4">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-sm font-medium text-text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
