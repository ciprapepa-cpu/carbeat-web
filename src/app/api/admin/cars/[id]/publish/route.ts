import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// PATCH /api/admin/cars/[id]/publish — toggle is_published
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(_request);
  const { allowed } = checkRateLimit(ip, { limit: 30, windowSeconds: 60 });
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Get current state
  const { data: car, error: fetchError } = await getSupabaseAdmin()
    .from("cars")
    .select("is_published")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Admin car publish fetch error:", fetchError.message);
    return NextResponse.json({ error: "Auto nenalezeno" }, { status: 404 });
  }

  // Toggle
  const { data, error } = await getSupabaseAdmin()
    .from("cars")
    .update({ is_published: !car.is_published })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin car publish error:", error.message);
    return NextResponse.json({ error: "Chyba při změně publikace" }, { status: 500 });
  }

  return NextResponse.json(data);
}
