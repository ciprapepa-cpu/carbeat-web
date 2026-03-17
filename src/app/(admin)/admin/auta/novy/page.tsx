import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarForm } from "../../_components/CarForm";

export default async function NewCarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/prihlaseni");
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
          <h1 className="text-xl font-bold text-text mt-1">Nový vůz</h1>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <CarForm mode="create" />
      </main>
    </div>
  );
}
