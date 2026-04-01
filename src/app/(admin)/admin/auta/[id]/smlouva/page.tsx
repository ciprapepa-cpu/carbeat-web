import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { ContractWizard } from "../../../_components/smlouva/ContractWizard";
import type { CarWithPhotos } from "@/types/car";

interface SmlouvaPageProps {
  params: Promise<{ id: string }>;
}

export default async function SmlouvaPage({ params }: SmlouvaPageProps) {
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
        <div className="max-w-[1400px] mx-auto px-6 py-4 print:hidden">
          <a
            href="/admin"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            ← Zpět na seznam
          </a>
          <h1 className="text-xl font-bold text-text mt-1">
            Kupní smlouva: {(car as CarWithPhotos).name}
          </h1>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 print:px-0 print:py-0 print:max-w-none">
        <ContractWizard car={car as CarWithPhotos} />
      </main>
    </div>
  );
}
