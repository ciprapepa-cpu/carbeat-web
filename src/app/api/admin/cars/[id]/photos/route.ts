import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { photoReorderSchema } from "@/lib/validations/car";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// POST /api/admin/cars/[id]/photos — upload photos
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Verify car exists
  const { error: carError } = await supabaseAdmin
    .from("cars")
    .select("id")
    .eq("id", id)
    .single();

  if (carError) {
    return NextResponse.json({ error: "Auto nenalezeno" }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("photos") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "Žádné soubory" }, { status: 400 });
  }

  // Get current max position
  const { data: existingPhotos } = await supabaseAdmin
    .from("car_photos")
    .select("position")
    .eq("car_id", id)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existingPhotos?.[0]?.position ?? -1) + 1;

  const uploaded: Array<{ id: string; storage_path: string; position: number }> = [];

  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      continue;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      continue;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${id}/${Date.now()}-${nextPosition}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("car-photos")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      continue;
    }

    const { data: photoRecord, error: insertError } = await supabaseAdmin
      .from("car_photos")
      .insert({
        car_id: id,
        storage_path: storagePath,
        position: nextPosition,
      })
      .select()
      .single();

    if (!insertError && photoRecord) {
      uploaded.push({
        id: photoRecord.id,
        storage_path: storagePath,
        position: nextPosition,
      });
    }

    nextPosition++;
  }

  return NextResponse.json({ uploaded }, { status: 201 });
}

// PUT /api/admin/cars/[id]/photos — reorder photos
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = photoReorderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validační chyba", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Update each photo's position
  for (const photo of parsed.data.photos) {
    await supabaseAdmin
      .from("car_photos")
      .update({ position: photo.position })
      .eq("id", photo.id)
      .eq("car_id", id);
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/cars/[id]/photos — delete a photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const photoId = searchParams.get("photoId");

  if (!photoId) {
    return NextResponse.json({ error: "photoId je povinný" }, { status: 400 });
  }

  // Get the photo to delete from storage
  const { data: photo, error: fetchError } = await supabaseAdmin
    .from("car_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("car_id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: "Foto nenalezeno" }, { status: 404 });
  }

  // Delete from storage
  await supabaseAdmin.storage.from("car-photos").remove([photo.storage_path]);

  // Delete from DB
  const { error } = await supabaseAdmin
    .from("car_photos")
    .delete()
    .eq("id", photoId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
