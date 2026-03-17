import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { CarForm } from "../../../_components/CarForm";
import type { CarWithPhotos } from "@/types/car";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/prihlaseni");
  }

  const { id } = await params;

  const { data: car, error } = await getSupabaseAdmin()
    .from("cars")
    .select("*, car_photos(id, car_id, storage_path, position, alt_text, created_at)")
    .eq("id", id)
    .single();

  if (error || !car) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <header className="bg-surface border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <a
            href="/admin"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            ← Zpět na seznam
          </a>
          <h1 className="text-xl font-bold text-text mt-1">
            Upravit: {(car as CarWithPhotos).name}
          </h1>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <CarForm car={car as CarWithPhotos} mode="edit" />
      </main>
    </div>
  );
}
