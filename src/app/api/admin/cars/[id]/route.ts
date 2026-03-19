import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { carSchema } from "@/lib/validations/car";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// GET /api/admin/cars/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await getSupabaseAdmin()
    .from("cars")
    .select("*, car_photos(id, storage_path, position, alt_text)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Admin car GET error:", error.message);
    return NextResponse.json({ error: "Auto nenalezeno" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/admin/cars/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip, { limit: 30, windowSeconds: 60 });
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = carSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validační chyba", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("cars")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Auto s tímto slugem již existuje" },
        { status: 409 }
      );
    }
    console.error("Admin car PUT error:", error.message);
    return NextResponse.json({ error: "Chyba při ukládání" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/cars/[id]
export async function DELETE(
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

  // Delete photos from storage first
  const { data: photos } = await getSupabaseAdmin()
    .from("car_photos")
    .select("storage_path")
    .eq("car_id", id);

  if (photos && photos.length > 0) {
    const paths = photos.map((p) => p.storage_path);
    await getSupabaseAdmin().storage.from("car-photos").remove(paths);
  }

  const { error } = await getSupabaseAdmin()
    .from("cars")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Admin car DELETE error:", error.message);
    return NextResponse.json({ error: "Chyba při mazání" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
