import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarListTable } from "./_components/CarListTable";
import type { CarWithPhotos } from "@/types/car";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logout } from "./_actions/auth";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/prihlaseni");
  }

  const { data: cars, error } = await supabaseAdmin
    .from("cars")
    .select("*, car_photos(id, storage_path, position, alt_text)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Chyba při načítání: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text">CarBeat Admin</h1>
            <p className="text-sm text-text-muted">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Zobrazit web →
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
              >
                Odhlásit se
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text">
            Vozidla ({(cars as CarWithPhotos[]).length})
          </h2>
          <a
            href="/admin/auta/novy"
            className="px-5 py-2.5 rounded-[8px] text-sm font-semibold bg-blue !text-white border-2 border-blue transition-all duration-[250ms] hover:bg-blue-hover hover:border-blue-hover"
          >
            + Přidat vůz
          </a>
        </div>

        <CarListTable cars={cars as CarWithPhotos[]} />
      </main>
    </div>
  );
}
